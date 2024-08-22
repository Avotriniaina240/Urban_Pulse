import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../styles/Analyse/UrbanAnalysis.css'; // Assurez-vous que ce fichier CSS est correctement configuré

const BarChart = ({ data, legend }) => {
    const ref = useRef();
    const [activeLegend, setActiveLegend] = useState(null);

    useEffect(() => {
        if (!data || data.length === 0) {
            return;
        }

        // Dimensions du graphique
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.selectAll('*').remove(); // Efface le contenu précédent

        // Échelles
        const x = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([height, 0]);

        // Barres avec animation
        svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.label))
            .attr('y', height) // Position initiale
            .attr('width', x.bandwidth())
            .attr('height', 0) // Hauteur initiale
            .attr('fill', d => (activeLegend === null || activeLegend === d.label) ? 'steelblue' : '#ddd') // Couleur selon la légende active
            .transition()
            .duration(1000)
            .attr('y', d => y(d.value))
            .attr('height', d => height - y(d.value)); // Animation

        // Axes
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));

        // Labels des axes
        svg.append('text')
            .attr('transform', `translate(${width / 2},${height + margin.bottom - 5})`)
            .style('text-anchor', 'middle')
            .text('Catégorie');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left + 10)
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('Valeur');
    }, [data, activeLegend]);

    const handleLegendClick = (label) => {
        setActiveLegend(activeLegend === label ? null : label);
    };

    return (
        <div className="chart-container">
            <svg ref={ref}></svg>
            {legend && (
                <div className="legend-container">
                    <h3 className="legend-title">{legend.title}</h3>
                    <ul className="legend-list">
                        {legend.items.map((item, index) => (
                            <li
                                key={index}
                                className="legend-item"
                                onClick={() => handleLegendClick(item.label)}
                            >
                                <span
                                    className="legend-color"
                                    style={{ backgroundColor: item.color }}
                                ></span>
                                <span className="legend-abbreviation">
                                    {item.abbreviation}
                                </span>: {item.label}
                                <p className="legend-description">
                                    {item.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BarChart;
