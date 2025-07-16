import { useParams } from "react-router-dom";

export default function OCStudentPage(props){
    const {id } = useParams();
    return <h1>this is {id}</h1>
}