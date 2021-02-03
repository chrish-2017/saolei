import { Component } from 'react';
import './App.css';

// 炸弹总数
const BUMP_COUNT = 1;
// 数组维度
const DIMESION = 20;

const statusObj = {
  close: 'close',
  open: 'open',
};

function getObj() {
  const obj = {
    status: statusObj.close, // 格子的状态
    isBump: false, // 是否为炸弹
    bumpCount: 0, // 周围格子的炸弹数
  };
  return obj;
}

// 获取周边格子的坐标系
function getXyArr (i, j) {
  return [
    [i-1, j-1], [i-1, j], [i-1, j+1],
    [i, j-1], [i, j+1],
    [i+1, j-1], [i+1, j], [i+1, j+1]
  ];
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
    // 初始化二维数组
    const mapArr = [];
    for (let i = 0; i < DIMESION; i++) {
      for (let j = 0; j < DIMESION; j++) {
        if (!mapArr[i]) mapArr[i] = [];
        mapArr[i][j] = getObj();
      }
    }

    // 标记炸弹
    this.setBump(mapArr);

    // 计算周围炸弹数
    this.setBumpCount(mapArr);

    this.setState({ mapArr });
  }

  // 标记炸弹
  setBump = (mapArr) => {
    let totalBumpCount = this.state.totalBumpCount;
    if (totalBumpCount < BUMP_COUNT) {
      const x = Math.floor(Math.random()*DIMESION);
      const y = Math.floor(Math.random()*DIMESION);
      if (!mapArr[x][y].isBump) {
        mapArr[x][y].isBump = true;
        this.state.totalBumpCount++;
      }
      this.setBump(mapArr);
    }
  }

  // 统计周围格子的数量
  setBumpCount = (mapArr) => {
    mapArr.forEach((lineArr, i) => {
      lineArr.forEach((cell, j) => {
        const xyArr = getXyArr(i, j);
        const countArr = xyArr.map(xy => this.isBump(mapArr, xy[0], xy[1]));
        let count = 0;
        countArr.forEach(c => {
          if (c) count++;
        })
        cell.bumpCount = count;
      })
    })
  }

  // 周围格子是否有炸弹
  isBump = (mapArr, row, col) => {
    const rowLen = mapArr.length;
    const colLen = mapArr[0].length;
    if (row >= 0 && row < rowLen && col >= 0 && col < colLen) {
      return mapArr[row][col].isBump;
    }
    return false;
  }

  // 打开周围的格子
  openCell = (mapArr, row, col) => {
    const rowLen = mapArr.length;
    const colLen = mapArr[0].length;
    if (row >= 0 && row < rowLen && col >= 0 && col < colLen) {
      mapArr[row][col].status = statusObj.open;
    }
  }

  handleClick = (cell, i, j) => {
    const status = cell.status;
    if (status === statusObj.close) {
      cell.status = statusObj.open;
    }

    this.setState({ mapArr: this.state.mapArr });

    if (cell.isBump) {
      setTimeout(() => {
        alert('Game Over !!!');
        window.location.reload();
      })
      return;
    } else if (cell.bumpCount === 0) {
      const mapArr = this.state.mapArr;

      const xyArr = getXyArr(i, j);
      xyArr.map(xy => this.openCell(mapArr, xy[0], xy[1]));
      this.setState({ mapArr }, () => {
        this.testWinGame();
      });
    }
    this.testWinGame();
  }

  // 测试游戏是否已经胜利
  testWinGame = () => {
    let isWin = true;
    const mapArr = this.state.mapArr;
    mapArr.forEach(row => {
      row.forEach(cell => {
        if (!cell.isBump && cell.status === statusObj.close) {
          isWin = false;
        }
      })
    })

    if (isWin) {
      setTimeout(() => {
        alert('Win!!!');
        window.location.reload();
      })
    }
  }

  render () {
    return (
      <div className="container">
        <button onClick={() => window.location.reload()}>Restart</button>
        {
          this.state.mapArr.map((row, i) => (
            <div className="row">
              {
                row.map((cell, j) => {
                  const isOpen = cell.status === statusObj.open;
                  let text = cell.isBump ?  '*' : cell.bumpCount;
    
                  if (cell.isBump) {
                    text = isOpen ? '*' : '';
                  } else {
                    text = isOpen && cell.bumpCount ? cell.bumpCount : '';
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
        }
      </div>
    );
  }
}

export default App;
