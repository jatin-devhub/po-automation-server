import { RequestHandler } from "express";
import * as fs from 'fs';
import { citiesUrl, countriesUrl, localCitiesUrl, localCountriesUrl, localStatesUrl, statesUrl } from "../utils/util-values";

interface Country {
  id: number;
  name: string;
  iso2: string;
}

interface State {
  id: number;
  name: string;
  country_code: string;
  state_code: string;
}

interface City {
  id: number;
  name: string;
  state_code: string;
}

export const getCountries: RequestHandler = async (req, res) => {
  try {
    let response = await fetch(countriesUrl);
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
      const data = await response.json();
      const filteredData: Country[] = data.map((country: any) => ({
        id: country.id,
        name: country.name,
        iso2: country.iso2
      }));

      res.json(filteredData);
    }
  } catch (error: any) {
    return res.status(504).json({
      success: false,
      message: error.message,
      data: {
        "source": "util.controller.ts -> getCountries"
      }
    })
  }
}

export const getStates: RequestHandler = async (req, res) => {
  const countryCode = req.query.country_code as string;

  try {
    const response = await fetch(statesUrl);

    if (!response.ok) {
      console.log('Failed to fetch from remote source');
      
      fs.readFile(localStatesUrl, 'utf-8', (err, data) => {
        if (err) {
          res.status(500).json({ error: 'Failed to fetch data from both sources' });
          return;
        }
        
        const states = JSON.parse(data);
        const filteredStates = states
          .filter((state: any) => state.country_code === countryCode)
          .map((state: any) => ({
            id: state.id,
            name: state.name,
            country_code: state.country_code,
            state_code: state.state_code,
          }));

        res.json(filteredStates);
      });
    } else {
      const data = await response.json();

      const filteredData: State[] = data
        .filter((state: any) => state.country_code === countryCode)
        .map((state: any) => ({
          id: state.id,
          name: state.name,
          country_code: state.country_code,
          state_code: state.state_code,
        }));

      res.json(filteredData);
    }
  } catch (error: any) {
    return res.status(504).json({
      success: false,
      message: error.message,
      data: {
        source: 'util.controller.ts -> getStates',
      },
    });
  }
};

// getCities function
export const getCities: RequestHandler = async (req, res) => {
  const stateCode = req.query.state_code as string;

  try {
    const response = await fetch(citiesUrl);

    if (!response.ok) {
      console.log('Failed to fetch from remote source');
      
      fs.readFile(localCitiesUrl, 'utf-8', (err, data) => {
        if (err) {
          res.status(500).json({ error: 'Failed to fetch data from both sources' });
          return;
        }
        
        const cities = JSON.parse(data);
        const filteredCities = cities
          .filter((city: any) => city.state_code === stateCode)
          .map((city: any) => ({
            id: city.id,
            name: city.name,
            state_code: city.state_code,
          }));

        res.json(filteredCities);
      });
    } else {
      const data = await response.json();

      const filteredData: City[] = data
        .filter((city: any) => city.state_code === stateCode)
        .map((city: any) => ({
          id: city.id,
          name: city.name,
          state_code: city.state_code,
        }));

      res.json(filteredData);
    }
  } catch (error: any) {
    return res.status(504).json({
      success: false,
      message: error.message,
      data: {
        source: 'util.controller.ts -> getCities',
      },
    });
  }
};