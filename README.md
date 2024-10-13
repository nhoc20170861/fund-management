# [AlgoMind Dashboard - Giao diện quản lỹ quỹ từ thiện]()

![version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://discord.gg/7yQgN4Ex)

![Product Gif](./assets/demo_dashboard.gif)

**Example Pages**

If you want to get inspiration or just show something directly to your clients, you can jump start your development with our pre-built example pages. You will be able to quickly set up the basic structure for your web project.

## Table of Contents

- [Versions](#versions)
- [Demo](#demo)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [File Structure](#file-structure)
- [Browser Support](#browser-support)
- [Resources](#resources)
- [Licensing](#licensing)
- [Useful Links](#useful-links)

## Versions

[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/html-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/argon-dashboard?ref=adr-github-readme)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/react-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/argon-dashboard-react?ref=adr-github-readme)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/nodejs-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/argon-dashboard-nodejs?ref=adr-github-readme)

## Demo

| Dashboard Page                                                                                                                                                                                              | Icons Page                                                                                                                                                                                          | Tables Page                                                                                                                                                                                            | Maps Page                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [![Dashboard Page](https://github.com/creativetimofficial/public-assets/blob/master/argon-dashboard-react/dashboard-page.png?raw=true)](https://demos.creative-tim.com/argon-dashboard-react/#/admin/index) | [![Icons Page](https://github.com/creativetimofficial/public-assets/blob/master/argon-dashboard-react/icons-page.png?raw=true)](https://demos.creative-tim.com/argon-dashboard-react/#/admin/icons) | [![Tables Page](https://github.com/creativetimofficial/public-assets/blob/master/argon-dashboard-react/tables-page.png?raw=true)](https://demos.creative-tim.com/argon-dashboard-react/#/admin/tables) | [![Maps Page](https://github.com/creativetimofficial/public-assets/blob/master/argon-dashboard-react/maps-page.png?raw=true)](https://demos.creative-tim.com/argon-dashboard-react/#/admin/maps) |

| Register Page                                                                                                                                                                                             | Login Page Page                                                                                                                                                                                         | Profile Page                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Login Page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-react/register-page.png)](https://demos.creative-tim.com/argon-dashboard-react/#/auth/register) | [![Login Page Page](https://github.com/creativetimofficial/public-assets/blob/master/argon-dashboard-react/login-page.png?raw=true)](https://demos.creative-tim.com/argon-dashboard-react/#/auth/login) | [![Profile Page](https://github.com/creativetimofficial/public-assets/blob/master/argon-dashboard-react/user-page.png?raw=true)](https://demos.creative-tim.com/argon-dashboard-react/#/admin/user-profile) |

[View More](https://demos.creative-tim.com/argon-dashboard-react?ref=adr-github-readme)

## How to run

- Clone the repo: `git clone https://github.com/AlgoRMind/frontend`.
- `npm i && npm run start dev`

## Documentation

The documentation for the Material Kit is hosted at our [website](https://demos.creative-tim.com/argon-dashboard-react/#/documentation/overview).

## File Structure

Within the download you'll find the following directories and files:

```
Argon Dashboard React
.
├── Documentation
│   └── documentation.html
├── CHANGELOG.md
├── ISSUE_TEMPLATE.md
├── LICENSE
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── assets
    │   ├── css
    │   │   ├── argon-dashboard-react.css
    │   │   ├── argon-dashboard-react.css.map
    │   │   └── argon-dashboard-react.min.css
    │   ├── fonts
    │   │   └── nucleo
    │   ├── img
    │   │   ├── brand
    │   │   ├── icons
    │   │   │   └── common
    │   │   └── theme
    │   ├── scss
    │   │   ├── argon-dashboard-react.scss
    │   │   ├── bootstrap
    │   │   │   ├── mixins
    │   │   │   └── utilities
    │   │   ├── core
    │   │   │   ├── alerts
    │   │   │   ├── avatars
    │   │   │   ├── badges
    │   │   │   ├── buttons
    │   │   │   ├── cards
    │   │   │   ├── charts
    │   │   │   ├── close
    │   │   │   ├── custom-forms
    │   │   │   ├── dropdowns
    │   │   │   ├── footers
    │   │   │   ├── forms
    │   │   │   ├── headers
    │   │   │   ├── icons
    │   │   │   ├── list-groups
    │   │   │   ├── maps
    │   │   │   ├── masks
    │   │   │   ├── mixins
    │   │   │   ├── modals
    │   │   │   ├── navbars
    │   │   │   ├── navs
    │   │   │   ├── paginations
    │   │   │   ├── popovers
    │   │   │   ├── progresses
    │   │   │   ├── separators
    │   │   │   ├── tables
    │   │   │   ├── type
    │   │   │   ├── utilities
    │   │   │   └── vendors
    │   │   ├── custom
    │   │   └── react
    │   └── vendor
    │       ├── @fortawesome
    │       │   └── fontawesome-free
    │       │       ├── LICENSE.txt
    │       │       ├── css
    │       │       ├── js
    │       │       ├── less
    │       │       ├── scss
    │       │       ├── sprites
    │       │       ├── svgs
    │       │       │   ├── brands
    │       │       │   ├── regular
    │       │       │   └── solid
    │       │       └── webfonts
    │       └── nucleo
    │           ├── css
    │           └── fonts
    ├── components
    │   ├── Footers
    │   │   ├── AdminFooter.jsx
    │   │   └── AuthFooter.jsx
    │   ├── Headers
    │   │   ├── Header.jsx
    │   │   └── UserHeader.jsx
    │   ├── Navbars
    │   │   ├── AdminNavbar.jsx
    │   │   └── AuthNavbar.jsx
    │   └── Sidebar
    │       └── Sidebar.jsx
    ├── index.js
    ├── layouts
    │   ├── Admin.jsx
    │   └── Auth.jsx
    ├── routes.js
    ├── variables
    │   └── charts.jsx
    └── views
        ├── Index.jsx
        └── examples
            ├── Icons.jsx
            ├── Login.jsx
            ├── Maps.jsx
            ├── Profile.jsx
            ├── Register.jsx
            └── Tables.jsx
```

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/chrome-logo.png?raw=true" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/firefox-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/edge-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/safari-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/opera-logo.png" width="64" height="64">

## Resources

- Demo: <https://demos.creative-tim.com/argon-dashboard-react/#/admin/index?ref=adr-github-readme>

## Licensing

- Copyright 2023 Creative Tim (https://www.creative-tim.com/?ref=adr-github-readme)

- Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md?ref=creativetim)

## Useful Links

- [Tutorials](https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w?ref=creativetim)

### Social Media

Twitter: <https://twitter.com/CreativeTim?ref=creativetim>

Facebook: <https://www.facebook.com/CreativeTim?ref=creativetim>

Dribbble: <https://dribbble.com/creativetim?ref=creativetim>

Instagram: <https://www.instagram.com/CreativeTimOfficial?ref=creativetim>
