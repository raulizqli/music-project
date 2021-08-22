import './App.css';
import React from 'react';


function Searcher(props) {
	return <div className="row row-padding">
		<form onSubmit={props.submmitFunc}>
			<div className="input-group mb-3">
				<input type="text" value={props.artistName} onChange={props.textChange} className="form-control" placeholder="Type the artist name" aria-label="Type the artist name" aria-describedby="button-addon2"/>
				<button type="submit" className="btn btn-secondary fa fa-search">&nbsp;</button>
			</div>
		</form>
	</div>;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
			name : "",
			lastSearch : "Any"
    };
    this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event)
	{
		if ( this.state.name != "" )
		{
			fetch("https://itunes.apple.com/search?term="+this.state.name.replace(" ", "+")+"&entity=album")
	      .then(res => res.json())
	      .then(
	        (result) => {
	          this.setState({
	            isLoaded: true,
	            items: result.results
	          });
	        },
	        (error) => {
	          this.setState({
	            isLoaded: true,
	            error
	          });
	        }
	      );	
		}
		this.setState({lastSearch:this.state.name});
		event.preventDefault();
	}
	
	handleChange(event)
	{
		this.setState({name: event.target.value});
	}
	

  render() {
    const { error, isLoaded, items } = this.state;
		const colors = ["blue", "red", "green", "pink", "orange"];
		if (error) {
      return <div>
					<div>
						<Searcher textChange={this.handleChange} submmitFunc={this.handleSubmit} artistName={this.state.name}/>
						<hr/>
					</div>
					<div>Error...{error}</div>
				</div>;
    } else if (!isLoaded) {
      return <div>
					<div>
						<Searcher textChange={this.handleChange} submmitFunc={this.handleSubmit} artistName={this.state.name}/>
						<hr/>
					</div>
					<div></div>
				</div>;
    }
		else if (items.length === 0) {
			return <div>
					<div>
						<Searcher textChange={this.handleChange} submmitFunc={this.handleSubmit} artistName={this.state.name}/>
						<hr/>
					</div>
					<div>Empty result for: {this.state.lastSearch}</div>
				</div>;
		}else {
      return (
				<div>
					<Searcher textChange={this.handleChange} submmitFunc={this.handleSubmit} artistName={this.state.name}/>
					<hr/>
					<div className="col-12">
						<div>
							<div id={items[0].artistId} className="team-content text-center main-box">
								<h3 className="name" title={items[0].artistName} >{items[0].artistName}</h3>
								<h4 className="title" title={items[0].primaryGenreName} >{items[0].primaryGenreName}</h4>
							</div>
						</div>
					</div>
					<div class="row">
						{
							items.map( function ( item ) {
									return <div className="col-12 col-sm-6 col-md-4 col-lg-3">
							      <div className={"fancy-effect fancy-effect-"+colors[Math.floor(Math.random()*5)]}>
							        <div className="picture">
							          <img className="img-fluid" alt={item.collectionName} src={item.artworkUrl100}/>
							        </div>
							        <div id={item.collectionId} className="team-content">
							          <h3 className="name" title={item.collectionName}>{item.collectionName}</h3>
							          <h4 className="title" title={item.primaryGenreName}>{item.primaryGenreName} - {item.trackCount} Track{(item.trackCount > 1)? "s" :""}</h4>
							        </div>
							        <ul class="social">
							          <li><a className="fa fa-facebook" aria-hidden="true"></a></li>
							          <li><a className="fa fa-twitter" aria-hidden="true"></a></li>
							          <li><a href={item.collectionViewUrl} className="fa fa-apple" aria-hidden="true"></a></li>
							          <li><a className="fa fa-instagram" aria-hidden="true"></a></li>
							        </ul>
							      </div>
							    </div>;
			        })
						}
					</div>
				</div>
      );
    }
  }
}
export default App;
