import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'

function InfoBox({title, cases, total}) {
    return (
       <Card className="infoBox">
           <CardContent>
              {/*Title i.e Coronavirus Cases*/}
              <Typography className="infoBox__title" color="textSecondary">{title} </Typography>

                   

              {/*+120k Number of Cases*/}
              <h2 className="infoBox__cases">{cases}</h2>

              {/*1.2M Total*/}
              <Typography className="infoBox__total" color="textSecondary">
                  {total} Total
              </Typography>



           </CardContent>
           
       </Card>
    )
}

export default InfoBox
