import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={Index} />
          <Route path="/:id" component={AdditionalInfo} />
        </div>
      </Router>
    );
  }
}

class Index extends Component {

  constructor() {
    super();
    this.state = {
      offers: [],
    };
  }

  async componentDidMount() {
    const response = await axios.get('https://localhost:5001/api/values');
    const data = response.data.map(offer => ({
      ...offer,
      periodStart: new Date(offer.periodStart),
      periodEnd: new Date(offer.periodEnd)
    }));
    this.setState({offers: data});
  }

  render() {
    return (
      <div style={{padding: 16}}>
        <Grid container spacing={16}>
          {this.state.offers.map(offer =>
            <Grid item xs={4} key={offer.id}>
              <Card>
                <CardMedia
                  image={offer.photoCard.thumbnail}
                  alt={offer.title}
                  component="img"
                />
                <CardContent>
                  <MainInfo offer={offer} />
                </CardContent>
                <CardActions>
                  <Link to={`/${offer.id}`}>
                    Подробная информация
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

class AdditionalInfo extends Component {

  constructor() {
    super();
    this.state = {
      offer: null
    };
  }

  async componentDidMount() {
    const response = await axios.get(`https://localhost:5001/api/values/${this.props.match.params.id}`);
    const offer = {...response.data,
      periodStart: new Date(response.data.periodStart),
      periodEnd: new Date(response.data.periodEnd)
    };

    this.setState({offer: offer});
  }
  render() {
    if (this.state.offer === null) {
      return null;
    }

    return (
      <div>
        <img src={this.state.offer.photoCard.thumbnail} alt={this.state.offer.title} />
        <MainInfo offer={this.state.offer} />
        <Typography component="p">
          Описание:
              {this.state.offer.description}
        </Typography>
        <Typography component="p">
          Маршрут:
              {this.state.offer.route.join(', ')}
        </Typography>
        {this.state.offer.photoAlbum !== null ?
          <GridList cellHeight={160} cols={3}>
            {this.state.offer.photoAlbum.map(el => (
              <GridListTile key={el.photo} cols={1}>
                <img src={el.photo} alt={this.state.offer.title} />
              </GridListTile>
            ))}
          </GridList>
          : null}
      </div>
    );
  }
}

const MainInfo = ({offer}) => (
  <>
    <Typography gutterBottom variant="h5" component="h2">
      {offer.title}
    </Typography>
    <Typography component="p">
      {offer.header}
    </Typography>
    <Typography component="p" color="primary">
      {offer.periodStart.toLocaleDateString("ru-ru")} - {offer.periodEnd.toLocaleDateString("ru-ru")}
    </Typography>
    <Typography component="p" color="secondary">
      {offer.minPrice} руб.
    </Typography>
  </>
);

export default App;
