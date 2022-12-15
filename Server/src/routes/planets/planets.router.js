const planetRouter = require('express').Router();

const {getAllPlanets} = require('../planets/planets.controller');

planetRouter.get('/',getAllPlanets);

module.exports = {planetRouter};