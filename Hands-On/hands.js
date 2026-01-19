// Program 1: Check if a variable is a number
function check() {
  let a = 0;
  if (typeof a != Number) {
    console.log("not a number");
  } else {
    console.log("it is a number");
  }
}
check();

// Program 2: Print first 6 characters of a string
function firstfive() {
  let a = " Hello this is js";
  let b = "";
  for (let i = 0; i < 6; i++) {
    b += a[i];
  }
  console.log(b);
}
firstfive();

// Program 3: Even or odd from 0 to 15
function evenodd() {
  for (let i = 0; i <= 15; i++) {
    if (i % 2 === 0) {
      console.log("it is an even");
    } else {
      console.log("it is odd");
    }
  }
}
evenodd();

// Program 4: Array manipulation (pop and push)
function arrayman() {
  let a = ["Green", "Red", "Blue", "Orange", "Yellow"];
  a.pop("Yellow");
  a.pop("Orange");
  a.push("white");
  a.push("violet");
  console.log(a);
}
arrayman();

// Program 5: Convert each word to Title Case
let str = "This is string upper case";

let result = str
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

console.log(result);

// Program 6: Basic HTTP server response
const http = require("http");

const server = http.createServer((req, res) => {
  res.write("Hello from server!");
  res.end("bye");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Program 7: File system sync write and read
const fs = require("fs");
fs.writeFileSync("test.txt", "this is just testing the file system");
console.log("file written!");

const dat = fs.readFileSync("test.txt", { encoding: "utf-8" });
console.log(dat);

// Program 8: File system async write and read
fs.writeFile(
  "Asynctest.txt",
  "this is just testing the file system for Async",
  (err) => {
    if (err) throw err;
    console.log("file is written");
    console.log("file content below:");
    fs.readFile("Asynctest.txt", { encoding: "utf-8" }, (error, data) => {
      console.log(data);
    });
  }
);
console.log("file writing");

// Program 9: Path module basics
const path = require("path");
const file = "users/nayeem/projects/demo/app.js";
console.log(path.basename(file));
console.log(path.dirname(file));
console.log(path.extname(file));

console.log(__dirname + "/js hands-on/hands.js");
console.log(path.join(__dirname, "js hands-on", "hands.js"));

// Program 10: OS module basics
const os = require("os");

console.log("Username:", os.userInfo().username);
console.log("Home:", os.homedir());
console.log("Platform:", os.platform());
console.log("CPU:", os.cpus()[0].model);

console.log("Total Memory (GB):", (os.totalmem() / 1024 ** 3).toFixed(2));
console.log("Free Memory (GB):", (os.freemem() / 1024 ** 3).toFixed(2));

// Program 11: HTTP server routing using URL
const http2 = require("http");

const server2 = http2.createServer((req, res) => {
  const url = req.url;

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home Page ");
  } else if (url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About Page ");
  } else if (url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Contact Page ");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Page Not Found ");
  }
});

server2.listen(3001, () => {
  console.log("Server running on http://localhost:3000");
});

// Program 12: Video streaming server using ReadStream
const http3 = require("http");
const fs2 = require("fs");

http3
  .createServer((req, res) => {
    if (req.url === "/video") {
      res.writeHead(200, { "Content-Type": "video/mp4" });
      fs2.createReadStream("video.mp4").pipe(res);
    }
  })
  .listen(3002, () => console.log("Video server running"));

// Program 13: Promise basic example
const myPromise = new Promise((resolve, reject) => {
  let success = true;

  if (success) resolve("Success ");
  else reject("Failed ");
});

myPromise
  .then((msg) => console.log(msg))
  .catch((err) => console.log(err));

// Program 14: Callback async example with setTimeout
function fetchDataCallback(callback) {
  setTimeout(() => {
    callback("Data received ");
  }, 1000);
}

fetchDataCallback((result) => {
  console.log(result);
});

// Program 15: Promise with async/await example
function data() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("hello world");
    }, 1000);
  });
}

async function showData() {
  console.log(await data());
}

showData();

// Program 16: Promise error handling using catch
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = false;

      if (success) {
        resolve("Data received ");
      } else {
        reject("Promise failed ");
      }
    }, 1000);
  });
}

fetchDataPromise()
  .then((data) => console.log("Success:", data))
  .catch((err) => console.log("Error:", err));

// Program 17: Callback error handling (error-first callback)
function fetchDataErrorCallback(callback) {
  setTimeout(() => {
    const success = false;

    if (success) {
      callback(null, "Data received ");
    } else {
      callback("Something went wrong ", null);
    }
  }, 1000);
}

fetchDataErrorCallback((err, data) => {
  if (err) {
    console.log("Error:", err);
    return;
  }
  console.log("Success:", data);
});

// Program 18: Async/Await error handling using try/catch
function fetchDataAsyncAwait() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = false;

      if (success) {
        resolve("Data received ");
      } else {
        reject("Async/Await error ");
      }
    }, 1000);
  });
}

async function showAsyncAwait() {
  try {
    const data = await fetchDataAsyncAwait();
    console.log("Success:", data);
  } catch (err) {
    console.log("Error:", err);
  }
}

showAsyncAwait();

