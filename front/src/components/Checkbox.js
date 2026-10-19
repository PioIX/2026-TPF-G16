export default function Checkbox({ id, text, change }) {
    const manejarCambio = (e) => {
        if (e.target.checked) {
            change(true, id);
        } else {
            change(false, id);
        }
    }

    return(
        <label>
            <input type="checkbox" onChange={(e) => {manejarCambio(e)}}></input>
            {text}
        </label>
    )
}