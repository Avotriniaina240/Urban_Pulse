import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import '../styles/Analyse/UrbanAnalysis.css'; // Assurez-vous que ce fichier CSS est correctement configuré

const BarChart = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            console.log('Aucune donnée disponible');
            return;
        }

        // Dimensions du graphique
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Créer le SVG et le groupe pour le graphique
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

        // Barres
        svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.label))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.value))
            .attr('fill', 'steelblue'); // Couleur des barres

        // Axes
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle');

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left + 10)
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('Valeur');

        // Labels des axes
        svg.append('text')
            .attr('transform', `translate(${width / 2},${height + margin.bottom - 5})`)
            .style('text-anchor', 'middle')
            .text('Catégorie');
    }, [data]);

    return (
        <div className="chart-container">
            <svg ref={ref}></svg>
        </div>
    );
};

export default BarChart;
