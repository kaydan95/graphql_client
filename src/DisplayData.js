import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery, gql } from '@apollo/client';


const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            username
            age
            nationality
        }
    }
`;

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies {
            name
            yearOfPublication
        }
    }
`;

const QUERY_GET_MOVIE_BY_NAME = gql`
    query GetMovieByName($name : String!) {
        movie(name : $name) {
            name
            yearOfPublication
        }
    }
`;

const MUTATION_CREATE_USER = gql`
    mutation CreateUser($input : CreateUserInput!){
        createUser(input : $input) {
            id
            name
            username
            age
            nationality
        }
    }
`;

function DisplayData(){
    const [movieSearched , setMovieSearched] = useState("");

    // create User
    const [name , setName] = useState("");
    const [username , setUsername] = useState("");
    const [age , setAge] = useState("");
    const [nationality , setNationality] = useState("");

    const { data, refetch, loading } = useQuery(QUERY_ALL_USERS);
    const { data : movieData } = useQuery(QUERY_ALL_MOVIES);
    const [fetchMovie, {data:movieSearchData, error:movieSearchError}] = useLazyQuery(QUERY_GET_MOVIE_BY_NAME);

    const [createUser] = useMutation(MUTATION_CREATE_USER);

    if(loading){
        return <h1>Something good is coming..!</h1>
    }

    return (
        <div>
            <div>
                <input type="text" placeholder="name.." 
                onChange = {(event) => {
                    setName(event.target.value);
                }}/><br/>
                <input type="text" placeholder="username.."
                onChange = {(event) => {
                    setUsername(event.target.value);
                }}/><br/>
                <input type="number" placeholder="age.."
                onChange = {(event) => {
                    setAge(Number(event.target.value));
                }}/><br/>
                <input type="text" placeholder="nationality.."
                onChange = {(event) => {
                    setNationality(event.target.value.toUpperCase());
                }}/><br/>
                <button onClick = {() => {
                    createUser({
                        variables :{
                            input : {
                                name,
                                username,
                                age,
                                nationality
                            }
                        }
                    });

                    refetch();
                }}>Create User</button>
            </div>

            <hr></hr>

            {data && data.users.map((user) => {
                return <div>
                    <span>Name : {user.name} /</span>
                    <span> UserName : {user.username} /</span>
                    <span> Age : {user.age} /</span>
                    <span> Nationality : {user.nationality}</span>
                </div>
            })}

            <hr></hr>

            {movieData && movieData.movies.map((movie) => {
                return (
                    <div>
                        <span>Movie Name : {movie.name}</span>
                        <span>( {movie.yearOfPublication} )</span>
                    </div>
                )
            })}

            <hr></hr>

            <div>
                <input type="text" placeholder="1917" onChange={(event) => {setMovieSearched(event.target.value)}}/>
                <button onClick={()=>{
                    fetchMovie({
                        variables : {
                            name : movieSearched
                        }
                    })
                }}>Fetch Data</button>
                <div>
                    {movieSearchData && (<div>
                        <span>Movie : {movieSearchData.movie.name} ({movieSearchData.movie.yearOfPublication})</span>
                    </div>)}
                </div>
                {movieSearchError && <div>
                        <span>Theres no Matched Movie</span>
                    </div>}
            </div>
        </div>
    )
}

export default DisplayData;