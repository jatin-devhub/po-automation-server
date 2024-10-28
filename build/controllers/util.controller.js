"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCities = exports.getStates = exports.getCountries = void 0;
const fs = __importStar(require("fs"));
const countriesUrl = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries.json';
const statesUrl = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states.json';
const citiesUrl = 'https://github.com/dr5hn/countries-states-cities-database/raw/refs/heads/master/json/cities.json';
const localCountriesUrl = './data/countries.json';
const localStatesUrl = './data/states.json';
const localCitiesUrl = './data/cities.json';
const getCountries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fetch(countriesUrl);
        if (!response.ok) {
            console.log('Failed to fetch from remote source');
            fs.readFile(localCountriesUrl, 'utf-8', (err, data) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to fetch data from both sources' });
                    return;
                }
                res.json(JSON.parse(data));
            });
        }
        else {
            const data = yield response.json();
            const filteredData = data.map((country) => ({
                id: country.id,
                name: country.name,
                iso2: country.iso2
            }));
            res.json(filteredData);
        }
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                "source": "util.controller.ts -> getCountries"
            }
        });
    }
});
exports.getCountries = getCountries;
const getStates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const countryCode = req.query.country_code;
    try {
        const response = yield fetch(statesUrl);
        if (!response.ok) {
            console.log('Failed to fetch from remote source');
            fs.readFile(localStatesUrl, 'utf-8', (err, data) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to fetch data from both sources' });
                    return;
                }
                const states = JSON.parse(data);
                const filteredStates = states
                    .filter((state) => state.country_code === countryCode)
                    .map((state) => ({
                    id: state.id,
                    name: state.name,
                    country_code: state.country_code,
                    state_code: state.state_code,
                }));
                res.json(filteredStates);
            });
        }
        else {
            const data = yield response.json();
            const filteredData = data
                .filter((state) => state.country_code === countryCode)
                .map((state) => ({
                id: state.id,
                name: state.name,
                country_code: state.country_code,
                state_code: state.state_code,
            }));
            res.json(filteredData);
        }
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                source: 'util.controller.ts -> getStates',
            },
        });
    }
});
exports.getStates = getStates;
// getCities function
const getCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stateCode = req.query.state_code;
    try {
        const response = yield fetch(citiesUrl);
        if (!response.ok) {
            console.log('Failed to fetch from remote source');
            fs.readFile(localCitiesUrl, 'utf-8', (err, data) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to fetch data from both sources' });
                    return;
                }
                const cities = JSON.parse(data);
                const filteredCities = cities
                    .filter((city) => city.state_code === stateCode)
                    .map((city) => ({
                    id: city.id,
                    name: city.name,
                    state_code: city.state_code,
                }));
                res.json(filteredCities);
            });
        }
        else {
            const data = yield response.json();
            const filteredData = data
                .filter((city) => city.state_code === stateCode)
                .map((city) => ({
                id: city.id,
                name: city.name,
                state_code: city.state_code,
            }));
            res.json(filteredData);
        }
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: {
                source: 'util.controller.ts -> getCities',
            },
        });
    }
});
exports.getCities = getCities;
