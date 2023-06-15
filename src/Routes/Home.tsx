import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence,useScroll  } from "framer-motion";
import { useState } from "react";
import useWindowDimensions from "../useWidowDimensions"

import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper =styled.div`
background-color:black;
`;
const Loader =styled.div`
height:20vh;
display:flex;
justify-content: center;
align-items: center;
`;
const Banner =styled.div<{bgPhoto:string}>`
height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
padding: 60px;
background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),url(${(props=>props.bgPhoto)});
background-size: cover;
`;
const Overview = styled.p`
width: 50%;
font-size:30px;
`;
const Title = styled.h2`
font-size: 68px;
margin-bottom: 30px;
`;

const Slider=styled(motion.div)`
position:relative;
top: -180px;
`;
const Row = styled(motion.div)`
display:grid;
grid-template-columns: repeat(6,1fr);
gap: 5px;
width: 100%;
position: absolute;
`;


const Box =styled(motion.div)<{bgPhoto:string}>`
background-color:#fff;
height: 200px;
background-image: url(${(props)=>props.bgPhoto});
background-size: cover;
background-position: center center;
cursor: pointer;
&:first-child{
  transform-origin: center left;
}
&:last-child{
  transform-origin: center right;
}
`;
const Info = styled(motion.div)`
padding: 10px;
background-color:${(props)=>props.theme.black.lighter};
opacity: 0;
position: absolute;
width: 100%;
bottom: 0;
h4{
  text-align: center;
  font-size: 18px;
}
`;

const Overlay = styled(motion.div)`
position: fixed;
top: 0;
width: 100%;
height: 100vh;
background-color:rgba(0,0,0,0.5) ;
opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position:absolute; 
  width:40vw;
  height:60vh; 
  left:0;
  right:0;
  margin:auto;
  background-color: ${props=>props.theme.black.lighter};
  border-radius: 15px ;
overflow: hidden;
`;
const BigCover = styled.div`
width: 100%;
background-size: cover;
background-position: center center;
height: 500px;

`;
const BigTitle = styled.h2`
color:${props=>props.theme.white.lighter};
font-size: 28px;
position: relative;
top: -60px;
padding: 10px;
`;

const BigOverview =styled.p`
position: relative;
top: -50px;
color:${props=>props.theme.white.lighter};
padding: 10px;
`;

const BoxVariants = {
  normal:{
    scale:1,
  },
  hover:{
    scale:1.3,
    y:-50,
    transition:{
      delay:0.3,
      duration:0.3,
      type:"tween"
    }
  },
};


const infoVariants ={
  hover:{
    opacity:1,
    transition:{
      delay:0.3,
      duration:0.3,
      type:"tween"
    }
  }
}
const offset =6;
function Home(){
  const history= useHistory();
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
  const {scrollY}=useScroll();
  const width = useWindowDimensions();

  const {data, isLoading}=useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const [index, setIndex]= useState(0);
  const increaseIndex = ()=>{
  if(data){
    if(leaving) return;
    toggleLeaving();
    const totalMovies =data.results.length-1;
    const maxIndex = Math.floor(totalMovies / offset)-1;
    setIndex((prev)=> (prev === maxIndex? 0: prev +1));
   }
  };
  const [leaving, setLeaving]= useState(false);
  const toggleLeaving =()=>setLeaving((prev)=>!prev);
  const onBoxClicked = (movieId:number)=>{
    history.push(`/movies/${movieId}`)
  };
  const onOverlayClicked =()=>history.push("/");
  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find((e)=>e.id+"" === bigMovieMatch.params.movieId);
  console.log(clickedMovie)
  return (<Wrapper>
    {isLoading? <Loader>loading..</Loader>:
    <>
    <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
      <Title>{data?.results[0].title}</Title>
      <Overview>{data?.results[0].overview}</Overview>
    </Banner>
    <Slider>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row 
        initial={{x: +width + 5 }}
        animate={{x: 0 }}
        exit={{x: -width - 5 }}
        transition={{type:"tween",duration:1}}
        key={index}>
        {data?.results.slice(1).slice(offset*index, offset*index+offset).map((e)=>(
          <Box
          layoutId={e.id+""}  
          key={e.id} 
          onClick={()=>onBoxClicked(e.id)}
          bgPhoto={makeImagePath(e.backdrop_path, "w500")} 
          variants={BoxVariants}
          whileHover="hover"
          initial="normal"
          transition={{type:"tween"}}
          >
            <Info variants={infoVariants}>
                <h4>{e.title}</h4>
            </Info>
          </Box>
          ))}
        </Row>
      </AnimatePresence>
    </Slider>
    <AnimatePresence>
      {bigMovieMatch? (
      <>
      <Overlay onClick={onOverlayClicked} animate={{opacity:1}} exit={{opacity:0}}/>
      <BigMovie layoutId={bigMovieMatch.params.movieId} style={{ top:scrollY.get()+100}}>
          {clickedMovie &&
           <>
           <BigCover  style={{backgroundImage:`linear-gradient(to top, black, transparent),url(${makeImagePath(clickedMovie.backdrop_path,"w500")})`}} />

          <BigTitle>{clickedMovie.title}</BigTitle>
          <BigOverview>{clickedMovie.overview}</BigOverview>
          </>
          }
      </BigMovie>
      </>):null}
    </AnimatePresence>
    </>}
  </Wrapper>);
}
export default Home;

