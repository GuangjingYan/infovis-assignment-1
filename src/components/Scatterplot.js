import React, { useRef, useEffect} from "react";
import * as d3 from "d3";



const Scatterplot = (props) => {

	const splotSvg = useRef(null);
	const svgSize = props.margin * 2 + props.size;

	useEffect(() => {
		//dataset
		let datasetX = props.data.map(d => parseFloat(d[0]));
		let datasetY = props.data.map(d => parseFloat(d[1]));

		//define axisX
		let linearX = d3.scaleLinear().domain([d3.min(datasetX), d3.max(datasetX)]).range([0, props.size]);
		let axisX = d3.axisBottom(linearX);

		//define axisY
		let linearY = d3.scaleLinear().domain([d3.min(datasetY), d3.max(datasetY)]).range([props.size, 0]);
		let axisY = d3.axisLeft(linearY);

		//append axisX
		const svg = d3.select(splotSvg.current);
		svg.append("g")
	 		 .attr("transform", `translate(${props.margin},${props.size + props.margin})`)
			 .call(axisX)

		//append axisY
		svg.append("g")
			 .attr("transform", `translate(${props.margin},${props.margin})`)
			 .call(axisY)

		//append dot
		const dotSvg = svg.append("g")
											.attr("transform", `translate(${props.margin},${props.margin})`)
		dotSvg.selectAll("circle")
					.data(props.data)
					.enter()
					.append("circle")
					.attr("class", (_,i) => `circle${i}`)
					.attr("r", props.radius)
					.attr("cx", d => linearX(d[0]))
					.attr("cy", d => linearY(d[1]))
		
	});

	return (
		<div>
			<svg ref={splotSvg} width={svgSize} height={svgSize}> 
			</svg>
		</div>
	)
};

export default Scatterplot;