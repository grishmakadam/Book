import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom'
import { AuthContext } from '../store/authContext'
import { useContext } from 'react'
import useLogout from '../hooks/useLogout';
import {Tooltip} from '@mui/material'
import Avatar from '@mui/material/Avatar';

function Header() {

  const { user } = useContext(AuthContext)
  const { logout } = useLogout()

  const [anchorElNav, setAnchorElNav] = useState();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

 
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const onlogout = async () => {
    await logout()
  }

  return (
    <AppBar position="sticky" style={{ width: "100%", boxSizing: "border-box", margin: 0, padding: 0 }}>
      <Container maxWidth="xl"  >
        <Toolbar disableGutters >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {user &&
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <Link to="/add" style={{ color: "#080906", textDecoration: 'none' }}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Add</Typography>
                  </MenuItem>
                </Link>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/" style={{ color: "#080906", textDecoration: 'none' }}><Typography textAlign="center">Show All</Typography></Link>
                </MenuItem>
               


              </Menu>
            }
            {/* {
              !user && <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <Link to="/user/login">
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">Log In</Typography>
                  </MenuItem>
                </Link>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/user/signup"><Typography textAlign="center">Sign Up</Typography></Link>
                </MenuItem>

              </Menu>
            } */}
          </Box>
          <Box sx={{ padding: 2 }}>



            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

            {user && <><Link to="/add" style={{ textDecoration: "none" }}>
              <Button

                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                ADD
              </Button>
            </Link>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button

                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Show All
                </Button>
              </Link>
            

            </>
            }
            {/* {
              !user && <><Link to="/user/signup" style={{ textDecoration: "none" }}>
                <Button

                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Sign Up
                </Button>
              </Link>
                <Link to="/user/login" style={{ textDecoration: "none" }}>
                  <Button

                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Log In
                  </Button>
                </Link>
              </>
            } */}

          </Box>

            {user &&  <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} >
                <Avatar alt={user.name[0].toUpperCase()} src={user.image} style={{backgroundColor:"#456781"}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            
            <Link to="/profile" style={{ textDecoration: "none" }}>
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                </Link>
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={onlogout}>Log Out</Typography>
                </MenuItem>
            </Menu>
          </Box>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;