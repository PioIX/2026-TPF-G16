export default function Checkbox({ id_car, text, change }) {
    const manejarCambio = (e) => {
        if (e.target.checked) {
            change(true, id_car);
        } else {
            change(false, id_car);
        }
    }

    return(
        <label>
            <input type="checkbox" onChange={(e) => {manejarCambio(e)}}></input>
            {text}
        </label>
    )
}