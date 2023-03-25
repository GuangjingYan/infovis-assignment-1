import React, { useRef, useEffect} from "react";
import * as d3 from "d3";



const Mainplot = (props) => {

	const splotSvg = useRef(null);
  const barplotSvg = useRef(null);
  const svgSize = props.margin * 2 + props.size;
	// data mean & deviation
	const dataMean = [d3.mean(props.data.map(d => parseFloat(d[0]))),d3.mean(props.data.map(d => parseFloat(d[1])))];
	const dataDev = [d3.deviation(props.data.map(d => parseFloat(d[0]))),d3.deviation(props.data.map(d => parseFloat(d[1])))];
	//barColor
	const barColor = ["#fff1ac","#d5a4cf"];

	let barSvg, ySvg, lineSvg;

	//dino plot
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


		//append brush
		const brush = d3.brush()
      .extent([[0, 0], [props.size, props.size]])
      .on("start brush end", brushed)
			//.on("start", cleared);
		const brushSvg = svg.append("g")
												.attr("transform", `translate(${props.margin},${props.margin})`)
												.call(brush)

		// function cleared(){
		// 	d3.selectAll("circle").attr("fill","black");
		// }

		function brushed(event) {
    let selection = event.selection;
		
		// brush none dot
    if (selection == null) {
      d3.selectAll("circle").attr("fill", "black");
			barUpdate(dataMean,dataDev);
      return;
    }
		let [[x0, y0],[x1, y1]] = selection;
		//in section
		const databrushed = props.data.map((d, i)=>{
			const dataTX = linearX(parseFloat(d[0]));
			const dataTY = linearY(parseFloat(d[1]));
			if(x0 <= dataTX && dataTX <= x1 && y0 <= dataTY && dataTY <= y1
				)return true;
			else return false;	
		});
		const inSectionId = databrushed.reduce((acc, cur, i) => {
			if (cur) acc.push(i);
			return acc;
		}, [])
		d3.selectAll("circle").attr("fill","black");
		// set section color
		inSectionId.forEach(e =>{
			d3.selectAll(`.circle${e}`)
				.attr("fill","red");
		} )
		// brush update
		if( inSectionId.length === 0 || inSectionId.length === 1){
			barUpdate(dataMean,dataDev);
		}else
		{
			const sectionDataMean = [d3.mean(inSectionId.map(id => parseFloat(props.data[id][0]))),d3.mean(inSectionId.map(id => parseFloat(props.data[id][1])))];
			const sectionDataDev = [d3.deviation(inSectionId.map(i => parseFloat(props.data[i][0]))),d3.deviation(inSectionId.map(i => parseFloat(props.data[i][1])))];
			barUpdate(sectionDataMean,sectionDataDev);
		}
  }
	// eslint-disable-next-line
	}, []);

	//bar plot
	useEffect(()=>{
		//define axisX
		const xScale  = d3.scaleBand().domain([0, 1]).range([0, props.size]).align(0.5).padding(props.barPadding);
		const tickText  = d3.scaleBand().domain(["x", "y"]).range([0, props.size]).align(0.5).padding(props.barPadding);
		let axisX = d3.axisBottom(tickText);

		//define axisY
		const yMax = d3.max([dataMean[0],dataMean[1]]);
		const yScale  = d3.scaleLinear().domain([0, yMax]).range([props.size, 0]);
		let axisY = d3.axisLeft(yScale);

		//append axisX
		const svg = d3.select(barplotSvg.current);
		const xSvg = svg.append("g")
	 		 .attr("transform", `translate(${props.margin},${props.size + props.margin})`)
			 .call(axisX)

		//append axisY
		ySvg = svg.append("g")
			 .attr("transform", `translate(${props.margin},${props.margin})`)
			 .call(axisY)

		//append bar
		barSvg = svg.append("g")
								.attr("transform", `translate(${props.margin},${props.margin})`);

		barSvg.selectAll("rect")
					.data(dataMean)
					.enter()
					.append("rect")
					.attr("width", xScale.bandwidth())
          .attr("height", d => props.size - yScale(d))
					.attr("x", (_,i) => xScale(i))
					.attr("y",(d,_) => yScale(d))
					.attr("fill",(_,i)=>barColor[i])

		//append errorbar
		lineSvg = svg.append("g")
								 .attr("transform", `translate(${props.margin},${props.margin})`);
		
		lineSvg.selectAll("line")
					 .data(dataDev)
					 .enter()
					 .append("line")
					 .style("stroke","black")
					 .attr("x1", (d, i) => xScale(i) + xScale.bandwidth() / 2)
           .attr("x2", (d, i) => xScale(i) + xScale.bandwidth() / 2)
           .attr("y1", (d, i) => yScale(dataMean[i] + d))
           .attr("y2", (d, i) => yScale(dataMean[i] - d))

	},[])

	// update barplot
	function barUpdate(updateMean, updateDev){
		//define axisY
		const yMax = d3.max(updateMean);
		const yScale = d3.scaleLinear().domain([0, yMax]).range([props.size, 0]);
		let axisY = d3.axisLeft(yScale);
	
		//append axisY
		ySvg.call(axisY)
		
		barSvg.selectAll("rect")
					.data(updateMean)
					.join()
					.transition()
					.duration(10)
					.attr("y",d => yScale(d))
					.attr("height",d => {
						return props.size - yScale(d);});

		lineSvg.selectAll("line")
					 .data(updateDev)
					 .join()
					 .transition()
					 .duration(60)
					 .style("stroke","black")
           .attr("y1", (d, i) => yScale(updateMean[i] + d))
           .attr("y2", (d, i) => yScale(updateMean[i] - d))
			
		};

	return (
		<div>
			<svg ref={splotSvg} width={svgSize} height={svgSize}> 
			</svg>
      <svg ref={barplotSvg} width={svgSize} height={svgSize}> 
			</svg>

		</div>
	)
};

export default Mainplot;