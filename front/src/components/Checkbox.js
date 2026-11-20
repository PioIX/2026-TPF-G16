export default function Checkbox({ id, text, change, estaMarcado }) {
    return(
        <label>
            <input type="checkbox" onChange={(e) => {(e) => change(e.target.checked, id)}} checked={estaMarcado}></input>
            {text}
        </label>
    )
}