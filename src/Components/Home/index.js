import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import DesktopHome from '../Desktop/Home';
import MobileHome from '../Mobile/Home';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {
        return (
            <div>
                {/* Hidden on small & extra small screen */}
                <Grid container>
                    <Hidden only={['sm', 'xs']}>
                        <Grid item sm={3}>
                            <DesktopHome />
                        </Grid>
                    </Hidden>

                    {/* Hidden on large */}
                    <Hidden only={['lg']}>
                        <Grid item sm={3}>
                            <MobileHome />
                        </Grid>
                    </Hidden>
                </Grid>
            </div>
        )
    }


}

export default Home;