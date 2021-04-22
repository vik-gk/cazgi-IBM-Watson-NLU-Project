const express = require('express');
const app = new express();
const dotenv = require('dotenv')
dotenv.config()

app.use(express.static('client'))

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
    const {IamAuthenticator} = require ('ibm-watson/auth')

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1 ({
        version: '2020-08-01',
        authenticator: new IamAuthenticator ({
            apikey:api_key
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding
}

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    
	let instance = getNLUInstance()
	let url = req.query.url

	const analyzeParams = {
		'url': url,
		'features': {
			'emotion': {
				'document': true
			}
		}
	};

	instance.analyze(analyzeParams)
  .then(analysisResults => {
        let result = analysisResults.result.emotion.document.emotion;
        console.log(result)
        let reslist = []
        for (var emotion in result) {
            reslist.push({emotion: emotion, score: result[emotion]})
        }
		return res.send({"result": reslist});
  })
  .catch(err => {
		console.log('error:', err);
		return res.send({"error": "an error occured"})
  });

});

app.get("/url/sentiment", (req,res) => {
    let instance = getNLUInstance()
	let url = req.query.url

	const analyzeParams = {
		'url': url,
		'features': {
			'sentiment': {
				'document': true
			}
		}
	};

	instance.analyze(analyzeParams)
  .then(analysisResults => {
		let result = analysisResults.result;
		console.log(result)
		return res.send({"result": result.sentiment.document.label});
  })
  .catch(err => {
		console.log('error:', err);
		return res.send({"error": "an error occured"})
  });
});

app.get("/text/emotion", (req,res) => {
  let instance = getNLUInstance()
	let text = req.query.text

	const analyzeParams = {
		'text': text,
		'features': {
			'emotion': {
				'document': true
			}
		}
	};

	instance.analyze(analyzeParams)
  .then(analysisResults => {
		let result = analysisResults.result.emotion.document.emotion;
        console.log(result)
        let reslist = []
        for (var emotion in result) {
            reslist.push({emotion: emotion, score: result[emotion]})
        }
		return res.send({"result": reslist});
  })
  .catch(err => {
		console.log('error:', err);
		return res.send({"error": "an error occured"})
  });
});

app.get("/text/sentiment", (req,res) => {
  let instance = getNLUInstance()
	let text = req.query.text

	const analyzeParams = {
		'text': text,
		'features': {
			'sentiment': {
				'document': true
			}
		}
	};

	instance.analyze(analyzeParams)
  .then(analysisResults => {
		let result = analysisResults.result;
		return res.send({"result": result.sentiment.document.label});
  })
  .catch(err => {
		console.log('error:', err);
		return res.send({"error": "an error occured"})
  });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})