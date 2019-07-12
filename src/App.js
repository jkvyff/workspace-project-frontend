import React, { Component } from 'react';
import './App.css';
import { API_ROOT } from './constants';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NavBar from './components/NavBar'
import DocumentsPage from './containers/DocumentsPage'
import Login from './components/Login'

class App extends Component {
	
	state = {
		documents: [],
		activeDocument: null
	}

	componentDidMount() {
		this.fetch('documents')
	}

	fetch = value => {
		fetch(`${API_ROOT}/${value}`)
		.then(res => res.json())
		.then(json => this.setState({documents: json}))
	}

	handleReceivedDocument = document => {
    	this.setState( { documents: [...this.state.documents, document] });
  	};


	render() {
	  const { documents, activeDocument } = this.state;
	  return (
		<Router>
			<div className="App">
				<NavBar documents={documents} />
				<Route exact path="/" component={Login} />
				<Route path='/documents' render={routerProps => 
					<DocumentsPage {...routerProps} documents={documents} />
				}/>
			</div>
		</Router>
	  );
	}
}

export default App;