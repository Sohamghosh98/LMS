import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import './Carousel.css';

function Carousel() {
    return (
        <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img height="100%" width="100%" src='https://images.unsplash.com/photo-1560693478-dfdb32f2176a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='img' />
                    <div className="container">
                        <div className="carousel-caption text-start">
                            <h1>Learn, Grow, Succeed with Us</h1>
                            <p className="opacity-75">Join our LMS to access diverse courses, interactive content, and a supportive learning community. Start your journey to success today.</p>
                            <Link to="/signup">
                                <p><a className="btn btn-lg btn-primary" href="#home">Sign up today</a></p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img height="100%" width="100%" src='https://images.unsplash.com/photo-1588580000645-4562a6d2c839?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='img' />
                    <div className="container">
                        <div className="carousel-caption">
                            <h1>Discover. Learn. Achieve.</h1>
                            <p>Explore our LMS to find courses that match your goals. Learn at your own pace and achieve your dreams with our innovative tools.</p>
                            <p><a className="btn btn-lg btn-primary" href="#home">Learn more</a></p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img height="100%" width="100%" src='https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='img' />
                    <div className="container">
                        <div className="carousel-caption text-end">
                            <h1>Elevate Your Learning Experience</h1>
                            <p>Experience top-notch education with our cutting-edge LMS. Enhance your skills and knowledge in a seamless, engaging environment.</p>
                            <p><a className="btn btn-lg btn-primary" href='#home'>Browse gallery</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default Carousel;