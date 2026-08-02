import { SampleAnimation } from '../types';

export const SAMPLE_ANIMATIONS: SampleAnimation[] = [
  {
    id: 'success-checkmark',
    name: 'Success Checkmark',
    description: 'Animated checkmark icon with circle stroke reveal',
    category: 'UI & Icons',
    data: {
      v: '5.7.4',
      fr: 60,
      ip: 0,
      op: 90,
      w: 400,
      h: 400,
      nm: 'Success Checkmark',
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Checkmark',
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [200, 200, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ind: 0,
                  ty: 'sh',
                  ks: {
                    a: 0,
                    k: {
                      i: [[0, 0], [0, 0], [0, 0]],
                      o: [[0, 0], [0, 0], [0, 0]],
                      v: [[-45, 5], [-10, 40], [50, -35]],
                      c: false
                    }
                  }
                },
                {
                  ty: 'st',
                  c: { a: 0, k: [0.133, 0.772, 0.368, 1] },
                  o: { a: 0, k: 100 },
                  w: { a: 0, k: 22 },
                  lc: 2,
                  lj: 2
                },
                {
                  ty: 'trim',
                  s: { a: 0, k: 0 },
                  e: {
                    a: 1,
                    k: [
                      { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 25, s: [0] },
                      { t: 65, s: [100] }
                    ]
                  },
                  o: { a: 0, k: 0 }
                },
                { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
              ]
            }
          ]
        },
        {
          ddd: 0,
          ind: 2,
          ty: 4,
          nm: 'Circle',
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [200, 200, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'el', d: 1, s: { a: 0, k: [220, 220] }, p: { a: 0, k: [0, 0] } },
                {
                  ty: 'st',
                  c: { a: 0, k: [0.133, 0.772, 0.368, 1] },
                  o: { a: 0, k: 100 },
                  w: { a: 0, k: 16 },
                  lc: 2,
                  lj: 2
                },
                {
                  ty: 'trim',
                  s: { a: 0, k: 0 },
                  e: {
                    a: 1,
                    k: [
                      { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                      { t: 45, s: [100] }
                    ]
                  },
                  o: { a: 0, k: -90 }
                },
                { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'loading-spinner',
    name: 'Gradient Loading Spinner',
    description: 'Smooth rotating gradient arc spinner',
    category: 'Loaders',
    data: {
      v: '5.7.4',
      fr: 60,
      ip: 0,
      op: 120,
      w: 400,
      h: 400,
      nm: 'Loading Spinner',
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Arc',
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: {
              a: 1,
              k: [
                { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                { t: 120, s: [360] }
              ]
            },
            p: { a: 0, k: [200, 200, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'el', d: 1, s: { a: 0, k: [180, 180] }, p: { a: 0, k: [0, 0] } },
                {
                  ty: 'st',
                  c: { a: 0, k: [0.388, 0.4, 0.96, 1] },
                  o: { a: 0, k: 100 },
                  w: { a: 0, k: 20 },
                  lc: 2,
                  lj: 2
                },
                {
                  ty: 'trim',
                  s: { a: 0, k: 0 },
                  e: {
                    a: 1,
                    k: [
                      { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [10] },
                      { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 60, s: [80] },
                      { t: 120, s: [10] }
                    ]
                  },
                  o: {
                    a: 1,
                    k: [
                      { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                      { t: 120, s: [360] }
                    ]
                  }
                },
                { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'bouncing-heart',
    name: 'Pulsing Heart',
    description: 'Beating heart vector with scale easing',
    category: 'Graphics',
    data: {
      v: '5.7.4',
      fr: 60,
      ip: 0,
      op: 60,
      w: 400,
      h: 400,
      nm: 'Pulsing Heart',
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Heart',
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [200, 200, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [100, 100, 100] },
                { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 15, s: [130, 130, 100] },
                { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 30, s: [105, 105, 100] },
                { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 45, s: [120, 120, 100] },
                { t: 60, s: [100, 100, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ind: 0,
                  ty: 'sh',
                  ks: {
                    a: 0,
                    k: {
                      i: [[0, -35], [-35, 0], [0, 35], [0, 0], [0, -35], [35, 0]],
                      o: [[0, 35], [35, 0], [0, 0], [0, 35], [-35, 0], [0, -35]],
                      v: [[0, -50], [-60, -100], [0, 70], [0, 70], [60, -100], [0, -50]],
                      c: true
                    }
                  }
                },
                { ty: 'fl', c: { a: 0, k: [0.937, 0.266, 0.38, 1] }, o: { a: 0, k: 100 } },
                { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
              ]
            }
          ]
        }
      ]
    }
  }
];
