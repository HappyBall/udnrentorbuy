/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
        },
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [
        ],
        scripts = [
        ],
        symbols = {
            "stage": {
                version: "5.0.1",
                minimumCompatibleVersion: "5.0.0",
                build: "5.0.1.386",
                scaleToFit: "width",
                centerStage: "horizontal",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'Rectangle',
                            type: 'rect',
                            rect: ['-9px', '-11px', '1222px', '998px', 'auto', 'auto'],
                            fill: ["rgba(0,171,199,1)"],
                            stroke: [0,"rgba(0,0,0,1)","none"]
                        },
                        {
                            id: 'money',
                            display: 'none',
                            type: 'image',
                            rect: ['505px', '1008px', '175px', '181px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"money.png",'0px','0px'],
                            transform: [[],['360']]
                        },
                        {
                            id: 'hand01',
                            display: 'block',
                            type: 'image',
                            rect: ['405px', '-149px', '590px', '568px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"hand01.png",'0px','0px']
                        },
                        {
                            id: 'hand02',
                            display: 'none',
                            type: 'image',
                            rect: ['316px', '-151px', '728px', '545px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"hand02.png",'0px','0px']
                        },
                        {
                            id: 'money022',
                            display: 'none',
                            type: 'image',
                            rect: ['541px', '241px', '170px', '176px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"money022.png",'0px','0px'],
                            transform: [[],['360']]
                        },
                        {
                            id: 'abc3',
                            display: 'none',
                            type: 'image',
                            rect: ['600px', '411px', '40px', '42px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"abc3.png",'0px','0px']
                        },
                        {
                            id: 'house032',
                            display: 'none',
                            type: 'image',
                            rect: ['74px', '207px', '1057px', '232px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"house032.png",'0px','0px']
                        },
                        {
                            id: 'word23',
                            display: 'none',
                            type: 'image',
                            rect: ['252px', '473px', '717px', '374px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"word23.png",'0px','0px']
                        }
                    ],
                    style: {
                        '${Stage}': {
                            isStage: true,
                            rect: ['null', 'null', '1200px', '970px', 'auto', 'auto'],
                            overflow: 'hidden',
                            fill: ["rgba(255,255,255,1)"]
                        }
                    }
                },
                timeline: {
                    duration: 7811,
                    autoPlay: true,
                    data: [
                        [
                            "eid54",
                            "display",
                            1000,
                            0,
                            "linear",
                            "${abc3}",
                            'none',
                            'block'
                        ],
                        [
                            "eid52",
                            "display",
                            1000,
                            0,
                            "linear",
                            "${money022}",
                            'none',
                            'block'
                        ],
                        [
                            "eid68",
                            "display",
                            1000,
                            0,
                            "linear",
                            "${house032}",
                            'none',
                            'block'
                        ],
                        [
                            "eid143",
                            "top",
                            1000,
                            493,
                            "linear",
                            "${money022}",
                            '-203px',
                            '241px'
                        ],
                        [
                            "eid149",
                            "top",
                            1493,
                            944,
                            "linear",
                            "${money022}",
                            '241px',
                            '255px'
                        ],
                        [
                            "eid154",
                            "top",
                            3126,
                            538,
                            "linear",
                            "${money022}",
                            '255px',
                            '242px'
                        ],
                        [
                            "eid155",
                            "top",
                            3664,
                            336,
                            "linear",
                            "${money022}",
                            '242px',
                            '244px'
                        ],
                        [
                            "eid181",
                            "top",
                            4000,
                            376,
                            "linear",
                            "${money022}",
                            '244px',
                            '258px'
                        ],
                        [
                            "eid159",
                            "top",
                            5000,
                            250,
                            "linear",
                            "${money022}",
                            '258px',
                            '246px'
                        ],
                        [
                            "eid183",
                            "top",
                            5250,
                            341,
                            "linear",
                            "${money022}",
                            '246px',
                            '242px'
                        ],
                        [
                            "eid160",
                            "top",
                            5591,
                            608,
                            "linear",
                            "${money022}",
                            '242px',
                            '258px'
                        ],
                        [
                            "eid172",
                            "top",
                            6750,
                            500,
                            "linear",
                            "${money022}",
                            '258px',
                            '246px'
                        ],
                        [
                            "eid182",
                            "top",
                            7250,
                            506,
                            "linear",
                            "${money022}",
                            '246px',
                            '241px'
                        ],
                        [
                            "eid146",
                            "rotateZ",
                            1493,
                            944,
                            "linear",
                            "${money022}",
                            '333deg',
                            '174deg'
                        ],
                        [
                            "eid156",
                            "rotateZ",
                            3126,
                            1250,
                            "linear",
                            "${money022}",
                            '174deg',
                            '443deg'
                        ],
                        [
                            "eid161",
                            "rotateZ",
                            5000,
                            1199,
                            "linear",
                            "${money022}",
                            '443deg',
                            '181deg'
                        ],
                        [
                            "eid174",
                            "rotateZ",
                            6750,
                            1006,
                            "linear",
                            "${money022}",
                            '181deg',
                            '360deg'
                        ],
                        [
                            "eid142",
                            "left",
                            1000,
                            493,
                            "linear",
                            "${money022}",
                            '532px',
                            '535px'
                        ],
                        [
                            "eid145",
                            "left",
                            1493,
                            944,
                            "linear",
                            "${money022}",
                            '535px',
                            '397px'
                        ],
                        [
                            "eid153",
                            "left",
                            3126,
                            538,
                            "linear",
                            "${money022}",
                            '397px',
                            '522px'
                        ],
                        [
                            "eid170",
                            "left",
                            3664,
                            712,
                            "linear",
                            "${money022}",
                            '522px',
                            '661px'
                        ],
                        [
                            "eid158",
                            "left",
                            5000,
                            1199,
                            "linear",
                            "${money022}",
                            '661px',
                            '377px'
                        ],
                        [
                            "eid171",
                            "left",
                            6750,
                            1006,
                            "linear",
                            "${money022}",
                            '377px',
                            '541px'
                        ],
                        [
                            "eid29",
                            "display",
                            500,
                            0,
                            "linear",
                            "${hand02}",
                            'none',
                            'block'
                        ],
                        [
                            "eid43",
                            "display",
                            1000,
                            0,
                            "linear",
                            "${hand02}",
                            'block',
                            'none'
                        ],
                        [
                            "eid38",
                            "rotateZ",
                            500,
                            343,
                            "easeInOutSine",
                            "${money}",
                            '0deg',
                            '360deg'
                        ],
                        [
                            "eid34",
                            "display",
                            500,
                            0,
                            "linear",
                            "${money}",
                            'none',
                            'block'
                        ],
                        [
                            "eid42",
                            "display",
                            1000,
                            0,
                            "linear",
                            "${money}",
                            'block',
                            'none'
                        ],
                        [
                            "eid148",
                            "rotateZ",
                            1493,
                            944,
                            "linear",
                            "${house032}",
                            '0deg',
                            '-6deg'
                        ],
                        [
                            "eid152",
                            "rotateZ",
                            3126,
                            1250,
                            "linear",
                            "${house032}",
                            '-6deg',
                            '6deg'
                        ],
                        [
                            "eid157",
                            "rotateZ",
                            5000,
                            1199,
                            "linear",
                            "${house032}",
                            '6deg',
                            '-6deg'
                        ],
                        [
                            "eid173",
                            "rotateZ",
                            6805,
                            1006,
                            "linear",
                            "${house032}",
                            '-6deg',
                            '0deg'
                        ],
                        [
                            "eid180",
                            "display",
                            1493,
                            0,
                            "linear",
                            "${word23}",
                            'none',
                            'block'
                        ],
                        [
                            "eid41",
                            "top",
                            500,
                            500,
                            "linear",
                            "${hand02}",
                            '-151px',
                            '-583px'
                        ],
                        [
                            "eid141",
                            "left",
                            1000,
                            0,
                            "linear",
                            "${house032}",
                            '74px',
                            '74px'
                        ],
                        [
                            "eid27",
                            "display",
                            0,
                            0,
                            "linear",
                            "${hand01}",
                            'block',
                            'block'
                        ],
                        [
                            "eid28",
                            "display",
                            500,
                            0,
                            "linear",
                            "${hand01}",
                            'block',
                            'none'
                        ],
                        [
                            "eid184",
                            "left",
                            1493,
                            0,
                            "linear",
                            "${word23}",
                            '252px',
                            '252px'
                        ],
                        [
                            "eid185",
                            "left",
                            1493,
                            0,
                            "linear",
                            "${abc3}",
                            '600px',
                            '600px'
                        ],
                        [
                            "eid40",
                            "left",
                            1000,
                            0,
                            "linear",
                            "${hand02}",
                            '316px',
                            '316px'
                        ],
                        [
                            "eid37",
                            "top",
                            500,
                            500,
                            "easeInOutSine",
                            "${money}",
                            '268px',
                            '1008px'
                        ]
                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("house_edgeActions.js");
})("EDGE-29710808");