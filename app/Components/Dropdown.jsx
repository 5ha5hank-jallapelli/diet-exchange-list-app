'use client'

import { useState } from "react"
import FilteredData from "./FilteredData";

export default function Dropdown({props}) {
	const [category, setCategory] = useState("all");
	const [count, setCount] = useState(1)

	function handleDropdownClick(selectedOption) {
		setCategory(selectedOption);
		setCount(1)
	}

	function increaseCount() {
		setCount((previousCount) => previousCount + 1)
	}

	function decreaseCount() {
		setCount((previousCount => previousCount > 0 ? previousCount - 1 : previousCount = 1))
	}

	function resetCategory(category) {
		setCategory(category);
	}

	return (
		<div>
			<FilteredData 
			data={props.data} 
			exchangeCount={count} 
			category={category}
			handleDropdownClick={handleDropdownClick}
			onIncreaseCount={increaseCount}
			onDecreaseCount={decreaseCount}
			resetCategory={resetCategory} />
		</div>
	)
}