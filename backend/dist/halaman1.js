async function getData(url) {
	const response = await fetch(url, {
		method: "GET",
	});

	return response.json();
}

const searchBar = document.querySelector("input[type=text]");
// console.log(searchBar);
const details = document.getElementsByClassName("details")[0];

const debounce = (func, delay) => {
	let timerId;
	return function () {
		clearTimeout(timerId);
		timerId = setTimeout(() => func.apply(this, arguments), delay);
	};
};

const searchFunc = debounce(async () => {
	const response = await getData(`/api/${searchBar.value.toLowerCase()}`);
	// console.log(response);
	let studentList = "";
	response.data.forEach((data) => {
		let nim1 = "";
		if (String(data[1]).length == 8) {
			nim1 = String(data[1]);
		}
		let nim2 = "";
		if (String(data[2]).length == 8) {
			nim2 = String(data[2]);
		}
		let jurusan = "";
		if (data.length >= 4) {
			jurusan = data[3];
		}
		let splitter = "";
		if (jurusan !== "") {
			splitter = " - ";
		}
		const temp = `<div class="text">
                                    <p class="label">${data[0]} ${splitter} ${jurusan}</p>
                                    <p class="value">${nim1} ${nim2}</p>
                                </div>
                                <hr />`;
		studentList += temp;
	});
	details.innerHTML = studentList;
}, 400);

searchBar.onkeypress = searchFunc;
