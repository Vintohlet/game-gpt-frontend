import { CssBaseline } from "@mui/material"

export default function Layout(props){
 
    return(
          <div>
            <CssBaseline />
              {props.children}
            </div>
    )
}