export default function Checkbox({ id, text, change }) {
    const manejarCambio = (e) => {
        change(e.target.checked, id);
    }

    return(
        <label>
            <input type="checkbox" onChange={(e) => {manejarCambio(e)}}></input>
            {text}
        </label>
    )
}