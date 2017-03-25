var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
//url模块是Node.js标准库里面的
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl).end(function(err, res) {
	if(err) {
		return console.error(err);
	}

	var topicUrls = [];
	var $ = cheerio.load(res.text);

	//获取首页所有的链接
	$('#topic_list .topic_title').each(function(idx, element){
		var $tmp = $(element);
		var href = url.resolve(cnodeUrl,$tmp.attr('href'));
		topicUrls.push(href);
	});

	//得到一个eventproxy实例
	var ep = new eventproxy();

	ep.after('topic_html', topicUrls.length, function(topics){
		//topics是个数组，包含了40次ep.emit('topic_html',pair);
		topics = topics.map(function(topicPair){
			var topicUrl = topicPair[0];
			var topicHtml = topicPair[1];
			var $ = cheerio.load(topicHtml);
			return ({
				title: $('.topic_full_title').text().trim(),
				href: topicUrl,
				comment1: $('.reply_content').eq(0).text().trim(),
				 author1: $('.changes a').text().trim(),
				  score1: $('.big').text().trim()
			});
		});
		//TODO
		console.log('final:');
		console.log(topics);
	});

	topicUrls.forEach(function(topicUrl){
		superagent.get(topicUrl).end(function(err, res){
			console.log('fetch ' + topicUrl + ' successful');
			ep.emit('topic_html', [topicUrl, res.text]);
		});
	});
});



