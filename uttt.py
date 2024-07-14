import platform
from os import system
import time

uttBoard = [["_" for i in range(9)] for j in range(9)]
board = ["_" for i in range(9)]
WINS = [[0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
        ]

currentBoard = -1
p1 = 'X'
p2 = 'O'

def win(player):
    win_state = [
        [board[0], board[1], board[2]],
        [board[3], board[4], board[5]],
        [board[6], board[7], board[8]],
        [board[0], board[3], board[6]],
        [board[1], board[4], board[7]],
        [board[2], board[5], board[8]],
        [board[0], board[4], board[8]],
        [board[2], board[4], board[6]],
    ]
    if [player, player, player] in win_state:
        return True
    else:
        return False
    
def boardWin(x,player):
    win_state = [
        [uttBoard[x][0], uttBoard[x][1], uttBoard[x][2]],
        [uttBoard[x][3], uttBoard[x][4], uttBoard[x][5]],
        [uttBoard[x][6], uttBoard[x][7], uttBoard[x][8]],
        [uttBoard[x][0], uttBoard[x][3], uttBoard[x][6]],
        [uttBoard[x][1], uttBoard[x][4], uttBoard[x][7]],
        [uttBoard[x][2], uttBoard[x][5], uttBoard[x][8]],
        [uttBoard[x][0], uttBoard[x][4], uttBoard[x][8]],
        [uttBoard[x][2], uttBoard[x][4], uttBoard[x][6]],
    ]
    if [player, player, player] in win_state:
        return True
    else:
        return False

def boardDraw(x):
    empty = 0
    for i in uttBoard[x]:
        if i == '_':
            empty+=1
    if empty == 0 and not boardWin(x, 'X') and not boardWin(x, 'O'):
        return True
    else:
        return False

    
def gameOver():
    empty = 0
    for i in board:
        if i == "_":
            empty+=1

    if win(p1):
        return True
    elif win(p2):
        return True
    elif empty == 0:
        return True
    else:
        return False
    
def boardChange(y):
    if(board[y] == "_"):
        cb = y
    else:
        cb = -1
    
    return cb

def nextCells(cb):
    cells = []
    if cb == -1:
        for x, row in enumerate(uttBoard):
            for y, cell in enumerate(row):
                if cell == "_" and board[x] == "_":
                    cells.append([x, y]) 
    if board[cb] == "_":
        for y, cell in enumerate(uttBoard[cb]):
            if cell == "_":
                cells.append([cb, y])
    
    return cells

def validMove(x,y,cb):
    if [x,y] in nextCells(cb):
        return True
    else:
        return False
    
def setMove(x,y,player, cb):
    if validMove(x, y, cb):
        uttBoard[x][y] = player
        return True
    else:
        return False

def displayBoard():
    # for k in range(3):
    #     for i in range(9):
    #         for j in range(3*k,3*(k+1)):
    #             if j!= 0 and j % 3 == 2:
    #                 print(str(j) + str(i)+ " " + uttBoard[j][i], end="  ")
    #             else:
    #                 print(str(j) + str(i)+ " " +uttBoard[j][i], end=" ")
    #         if i!= 0 and i % 3 == 2:
    #             print("")
    #     print("")
    for row_block in range(3):
        for row in range(3):
            line = ""
            for col_block in range(3):
                for col in range(3):
                    # line += f"{row_block * 30 + col_block * 10 + row * 3 + col:02} "
                    line = f"{row_block * 30 + col_block * 10 + row * 3 + col:02}"
                    print(uttBoard[int(line[0])][int(line[1])], end=" ")
                if col_block < 2:
                    print(end="  ") # Space between 3x3 blocks
            print()
        print("")  # Space between 3x3 block rows

    

def clean():
    os_name = platform.system().lower()
    if 'windows' in os_name:
        system('cls')
    else:
        system('clear')

def main():
    global currentBoard
    clean()
    moves = 0
    while not gameOver():
        # clean()
        if moves % 2 == 0:
            currentPlayer = p1
        else:
            currentPlayer = p2

        print(currentBoard)
        x, y = tuple(map(int,input(f'Enter your move {currentPlayer}: ').split(" ")))

        while not validMove(x,y,currentBoard):
            x, y = tuple(map(int,input(f'Enter your move {currentPlayer}: ').split(" ")))
        setMove(x,y,currentPlayer, currentBoard)

        if boardWin(x,currentPlayer):
            board[x] = currentPlayer
        
        currentBoard = boardChange(y)

        displayBoard()
        time.sleep(0.5)

        moves+=1
    
    if win(p1):
        print(f'{p1} Won')
    elif win(p2):
        print(f'{p2} Won')
    else:
        print('Draw')

if __name__ == '__main__':
    main()

            
            

        

