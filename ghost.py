i = 0
new_list = []
count = 0
k = 0
while i < len(num):
    j = 0
    while j < len(num[i]):
        if num[i][j] != 0 and num[i-1][j] != 0:
            new_list.append(num[i][j])
            while k < len(new_list):
                count = count + new_list[k]
                k = k + 1
        j = j + 1
    i = i + 1
print count