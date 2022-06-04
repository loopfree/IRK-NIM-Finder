const express = require("express");
const studentData = require("./data/data_13_21.json");

const fakultasCode = require("./data/kode_fakultas.json");
const fakultasList = require("./data/list_fakultas.json");

const jurusanCode = require("./data/kode_jurusan.json");
const jurusanList = require("./data/list_jurusan.json");

const numberRegex = /^[0-9]+$/;

app = express();

app.use(express.static("./dist/"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/dist/halaman1.html");
});

function checkJurusan(input) {
	let isJurusan = false;
	let jurusanKode = [];

	for (const key in jurusanCode) {
		const value = jurusanCode[key];
		if (key.toLowerCase() === input) {
			isJurusan = true;
			jurusanKode.push(String(jurusanCode[key]));
			break;
		}
	}

	if (jurusanKode.length === 0) {
		for (const key in jurusanList) {
			const value = jurusanList[key];
			if (String(value).toLowerCase().includes(input)) {
				isJurusan = true;
				jurusanKode.push(key);
			}
		}
	}

	return {
		isJurusan,
		jurusanKode,
	};
}

function checkFakultas(input) {
	let isFakultas = false;
	let fakultasKode = [];

	for (const key in fakultasCode) {
		const value = fakultasCode[key];
		if (key.toLowerCase() === input) {
			isFakultas = true;
			fakultasKode.push(String(fakultasCode[key]));
		}
	}

	if (fakultasKode.length === 0) {
		for (const key in fakultasList) {
			const value = fakultasList[key];
			if (String(value).toLowerCase().includes(input)) {
				isFakultas = true;
				fakultasKode.push(key);
			}
		}
	}

	return {
		isFakultas,
		fakultasKode,
	};
}

function addJurusan(param) {
	let result = [];
	param.forEach((data) => {
		const temp = [...data];
		if (temp.length >= 3) {
			temp.push(jurusanList[temp[2].substring(0, 3)]);
		}
		result.push(temp);
	});
	return result;
}

app.get("/api/:query", (req, res) => {
	const query = req.params.query;

	let isNumber = numberRegex.test(query);

	let result = [];

	if (isNumber) {
		studentData.forEach((data) => {
			if (
				String(data[2]).indexOf(query) !== -1 ||
				String(data[1]).indexOf(query) !== -1
			) {
				result.push(data);
			}
		});
	} else {
		const splitQuery = query.match(/\\?.|^$/g).reduce(
			(p, c) => {
				if (c === '"') {
					p.quote ^= 1;
				} else if (!p.quote && c === " ") {
					p.a.push("");
				} else {
					p.a[p.a.length - 1] += c.replace(/\\(.)/, "$1");
				}
				return p;
			},
			{ a: [""] }
		).a;
		if (splitQuery.length == 1) {
			input = splitQuery[0];
			/**
			 * checks for jurusan
			 */

			let check = checkJurusan(input);

			if (check.isJurusan) {
				studentData.forEach((data) => {
					check.jurusanKode.forEach((kode) => {
						if (String(data[2]).substring(0, 3) === kode) {
							result.push(data);
						}
					});
				});

				result = addJurusan(result);
				res.json({
					data: result,
				});
				return;
			}

			/**
			 * checks for fakultas
			 */

			check = checkFakultas(input);

			if (check.isFakultas) {
				studentData.forEach((data) => {
					check.fakultasKode.forEach((kode) => {
						if (String(data[1]).substring(0, 3) === kode) {
							result.push(data);
						}
					});
				});

				result = addJurusan(result);
				res.json({
					data: result,
				});
				return;
			}

			/**
			 * checks for name
			 */

			studentData.forEach((data) => {
				if (String(data[0]).toLowerCase().includes(input)) {
					result.push(data);
				}
			});
		} else if (splitQuery.length == 2) {
			const input1 = splitQuery[0];
			const input2 = splitQuery[1];

			let check = checkJurusan(input1);
			if (check.isJurusan) {
				studentData.forEach((data) => {
					check.jurusanKode.forEach((kode) => {
						if (
							String(data[2]).substring(0, 3) == kode &&
							String(data[2]).substring(3, 5) == input2
						) {
							result.push(data);
						}
					});
				});
				result = addJurusan(result);

				res.json({
					data: result,
				});

				return;
			}

			check = checkFakultas(input1);
			if (check.isFakultas) {
				studentData.forEach((data) => {
					check.fakultasKode.forEach((kode) => {
						if (
							String(data[1]).substring(0, 3) == kode &&
							String(data[1]).substring(3, 5) == input2
						) {
							result.push(data);
						}
					});
				});
				result = addJurusan(result);

				res.json({
					data: result,
				});

				return;
			}
		} else if (splitQuery.length == 3) {
			const input1 = splitQuery[0];
			const input2 = splitQuery[1];
			const input3 = splitQuery[2];

			let firstArr = [];
			let secondArr = [];
			let thirdArr = [];

			const input1IsNum = numberRegex.test(input1);

			if (input1IsNum) {
				studentData.forEach((data) => {
					if (
						String(data[1]).includes(input1) ||
						String(data[2]).includes(input1)
					) {
						firstArr.push(data);
					}
				});
			}

			let jurusanCheck;
			jurusanCheck = checkJurusan(input1);

			if (firstArr.length === 0 && jurusanCheck.isJurusan) {
				studentData.forEach((data) => {
					jurusanCheck.jurusanKode.forEach((kode) => {
						if (String(data[2]).substring(0, 3) === kode) {
							firstArr.push(data);
						}
					});
				});
			}

			let fakultasCheck;

			fakultasCheck = checkFakultas(input1);

			if (firstArr.length === 0 && fakultasCheck.isFakultas) {
				studentData.forEach((data) => {
					fakultasCheck.fakultasKode.forEach((kode) => {
						if (String(data[1]).substring(0, 3) === kode) {
							firstArr.push(data);
						}
					});
				});
			}
			if (firstArr.length === 0) {
				studentData.forEach((data) => {
					if (String(data[0]).toLowerCase().includes(input1)) {
						firstArr.push(data);
					}
				});
			}

			const input2IsNum = numberRegex.test(input2);

			if (input2IsNum) {
				studentData.forEach((data) => {
					if (
						String(data[1]).includes(input2) ||
						String(data[2]).includes(input2)
					) {
						secondArr.push(data);
					}
				});
			}

			let check2;

			check2 = checkJurusan(input2);

			if (secondArr.length === 0 && check2.isJurusan) {
				studentData.forEach((data) => {
					check2.jurusanKode.forEach((kode) => {
						if (String(data[2]).substring(0, 3) === kode) {
							secondArr.push(data);
						}
					});
				});
			}

			check2 = checkFakultas(input2);

			if (secondArr.length === 0 && check2.isFakultas) {
				studentData.forEach((data) => {
					check2.fakultasKode.forEach((kode) => {
						if (String(data[1]).substring(0, 3) === kode) {
							secondArr.push(data);
						}
					});
				});
			}
			if (secondArr.length === 0) {
				studentData.forEach((data) => {
					if (String(data[0]).toLowerCase().includes(input2)) {
						secondArr.push(data);
					}
				});
			}

			const input3IsNum = numberRegex.test(input3);

			if (input3IsNum) {
				studentData.forEach((data) => {
					if (
						String(data[1]).includes(input3) ||
						String(data[2]).includes(input3)
					) {
						thirdArr.push(data);
					}
				});
			}

			let check3;

			check3 = checkJurusan(input3);

			if (thirdArr.length === 0 && check3.isJurusan) {
				studentData.forEach((data) => {
					check3.jurusanKode.forEach((kode) => {
						if (String(data[2]).substring(0, 3) === kode) {
							thirdArr.push(data);
						}
					});
				});
			}

			check3 = checkFakultas(input3);

			if (thirdArr.length === 0 && check3.isFakultas) {
				studentData.forEach((data) => {
					check3.fakultasKode.forEach((kode) => {
						if (String(data[1]).substring(0, 3) === kode) {
							thirdArr.push(data);
						}
					});
				});
			}
			if (thirdArr.length === 0) {
				studentData.forEach((data) => {
					if (String(data[0]).toLowerCase().includes(input3)) {
						thirdArr.push(data);
					}
				});
			}
			let tempArr = [];

			for (let i = 0; i < firstArr.length; ++i) {
				for (let j = 0; j < secondArr.length; ++j) {
					if (firstArr[i][1] === secondArr[j][1]) {
						tempArr.push(firstArr[i]);
					}
				}
			}

			for (let i = 0; i < tempArr.length; ++i) {
				for (let j = 0; j < thirdArr.length; ++j) {
					if (tempArr[i][1] === thirdArr[j][1]) {
						result.push(tempArr[i]);
					}
				}
			}
		}
	}

	result = addJurusan(result);
	res.json({
		data: result,
	});
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Listening at ${port}`);
});
