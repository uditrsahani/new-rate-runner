import { Card, CardContent, CardHeader } from '@material-ui/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
// eslint-disable-next-line camelcase
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
// eslint-disable-next-line camelcase
import am4geodata_usaLow from '@amcharts/amcharts4-geodata/usaLow';
// eslint-disable-next-line camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import React, { useLayoutEffect } from 'react';

am4core.useTheme(am4themes_animated);

const FinanceSalesByContinent = (props) => {
  useLayoutEffect(() => {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    // eslint-disable-next-line no-shadow
    const chart = am4core.create('chartdiv', am4maps.MapChart);

    // Set map definition
    // eslint-disable-next-line camelcase
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Series for World map
    const worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.exclude = ['AQ'];
    worldSeries.useGeodata = true;

    const polygonTemplate = worldSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = chart.colors.getIndex(0);
    polygonTemplate.nonScalingStroke = true;

    // Hover state
    const hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#367B25');

    // Series for United States map
    const usaSeries = chart.series.push(new am4maps.MapPolygonSeries());
    // eslint-disable-next-line camelcase
    usaSeries.geodata = am4geodata_usaLow;

    const usPolygonTemplate = usaSeries.mapPolygons.template;
    usPolygonTemplate.tooltipText = '{name}';
    usPolygonTemplate.fill = chart.colors.getIndex(1);
    usPolygonTemplate.nonScalingStroke = true;

    // ...
    chart.current = chart;

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <Card {...props}>
      <CardHeader title="Top 10 Country" />
      <CardContent>
        <div
          id="chartdiv"
          style={{ width: '100%', height: '500px' }}
        />
      </CardContent>
    </Card>
  );
};

export default FinanceSalesByContinent;
