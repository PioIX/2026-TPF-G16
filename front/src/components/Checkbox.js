export default function Checkbox({ idCar, text }) {
    return(
        <div>
            <input type="checkbox" id={idCar}></input>
            <label for={idCar}>{text}</label>
        </div>
    )
}