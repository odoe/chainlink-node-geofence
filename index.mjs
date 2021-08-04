import pkg from '@chainlink/external-adapter';
const { Requester, Validator } = pkg;
import "cross-fetch/dist/node-polyfill.js";
import "abort-controller/polyfill.js"; // polyfill.mjs doesn't work since extensions are missing in abort-controller code

import esriConfig from "@arcgis/core/config.js";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Point from '@arcgis/core/geometry/Point.js';

esriConfig.request.useIdentity = false;

const itemId = 'd373ca438b7a40ac80733458236d02be';

const layer = new FeatureLayer({
  portalItem: {
    id: itemId
  }
});

const customParams = {
  lat: ['y', 'lat', 'latitude'],
  lon: ['x', 'lon', 'longitude']
}

export const createRequest = async(input, callback) => {
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const latitude = Number(validator.validated.data.lat);
  const longitude = Number(validator.validated.data.lon);

  await layer.load();
  const q = {
    returnGeometry: true,
    where: '1=1'
  };
  const { features } = await layer.queryFeatures(q);
  const point = new Point({ latitude, longitude });

  const isValid = features.some((feature) => {
    return feature.geometry.contains(point);
  });

  const response = {
    jobRunID,
    data: {
      result: isValid
    },
    status: 200
  };

  callback(response.status, Requester.success(jobRunID, response));
}
