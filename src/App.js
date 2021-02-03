import { Component } from 'react';
import './App.css';

const statusObj = {
  close: 'close',
  open: 'open',
};

function getObj() {
  const obj = {
    status: statusObj.close,
    isBump: false,
    bumpCount: 0,
  };
  return obj;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mapArr: [],
      totalBumpCount: 0,
    };
  }

  componentWillMount () {
    const mapArr = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (!mapArr[i]) mapArr[i] = [];
        mapArr[i][j] = getObj();
      }
    }

    this.setBump(mapArr);

    this.setBumpCount(mapArr);

    this.setState({ mapArr });
  }

  setBump = (mapArr) => {
    let totalBumpCount = this.state.totalBumpCount;
    if (totalBumpCount < 99) {
      const x = Math.floor(Math.random()*20);
      const y = Math.floor(Math.random()*20);
      if (!mapArr[x][y].isBump) {
        mapArr[x][y].isBump = true;
        this.state.totalBumpCount++;
      }
      this.setBump(mapArr);
    }
  }

  isBump = (mapArr, row, col) => {
    const rowLen = mapArr.length;
    const colLen = mapArr[0].length;
    if (row >= 0 && row < rowLen && col >= 0 && col < colLen) {
      return mapArr[row][col].isBump;
    }
    return false;
  }

  openBump = (mapArr, row, col) => {
    const rowLen = mapArr.length;
    const colLen = mapArr[0].length;
    if (row >= 0 && row < rowLen && col >= 0 && col < colLen) {
      mapArr[row][col].status = statusObj.open;
    }
  }

  setBumpCount = (mapArr) => {
    mapArr.forEach((lineArr, i) => {
      lineArr.forEach((cell, j) => {
        const countArr = [
          this.isBump(mapArr, i-1, j-1),
          this.isBump(mapArr, i-1, j),
          this.isBump(mapArr, i-1, j+1),
          this.isBump(mapArr, i, j-1),
          this.isBump(mapArr, i, j+1),
          this.isBump(mapArr, i+1, j-1),
          this.isBump(mapArr, i+1, j),
          this.isBump(mapArr, i+1, j+1),
        ];
        let count = 0;
        countArr.forEach(c => {
          if (c) count++;
        })
        cell.bumpCount = count;
      })
    })
  }

  handleClick = (cell, i, j) => {
    const status = cell.status;
    if (status === statusObj.close) {
      cell.status = statusObj.open;
    }

    this.setState({ mapArr: this.state.mapArr }, () => {
      if (cell.isBump) {
        return alert('游戏结束！');
      } else if (cell.bumpCount === 0) {
        const mapArr = this.state.mapArr;
        this.openBump(mapArr, i-1, j-1);
        this.openBump(mapArr, i-1, j);
        this.openBump(mapArr, i-1, j+1);
        this.openBump(mapArr, i, j-1);
        this.openBump(mapArr, i, j+1);
        this.openBump(mapArr, i+1, j-1);
        this.openBump(mapArr, i+1, j);
        this.openBump(mapArr, i+1, j+1);
        this.setState({ mapArr });
      }
    });
  }

  render () {
    return (
      this.state.mapArr.map((row, i) => (
        <div className="row">
          {
            row.map((cell, j) => {
              const isOpen = cell.status === statusObj.open;
              let text = cell.isBump ?  '*' : cell.bumpCount;

              if (cell.isBump) {
                text = isOpen ? '*' : '';
              } else {
                text = cell.bumpCount ? cell.bumpCount : '';
              }

              return (
                <span className={`cell ${isOpen ? 'open' : ''} ${cell.isBump ? 'bump' : ''}`} onClick={() => {
                  this.handleClick(cell, i, j)
                }}>
                  {text}
                </span>
              )
            })
          }
        </div>
      ))
    );
  }
}

export default App;
