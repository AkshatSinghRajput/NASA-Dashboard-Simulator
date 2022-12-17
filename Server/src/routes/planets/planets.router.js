const planetRouter = require('express').Router();

const {httpgetAllPlanets} = require('../planets/planets.controller');

planetRouter.get('/',httpgetAllPlanets);

module.exports = {planetRouter};