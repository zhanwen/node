var fib = function(n) {
	if(n === 0) {
		return 0;
	}
	if(n === 1) {
		return 1;
	}
	if(n > 10) {
		throw new Error('n should <= 10');
	}
	if(n < 0) {
		throw new Error('n should >= 0');
	}
	if(typeof n !== 'number') {
		throw new Error('n should be a Number');
	}

	return fib(n-1)+fib(n-2);
};

exports.fib = fib;

if(require.main === module) {
	var n = Number(process.argv[2]);
	console.log('fibonacci(' + n + ') is ' + fib(n));
}