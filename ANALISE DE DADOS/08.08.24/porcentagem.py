# Primeiro dia de aula de Analise de Dados, 08/08/2024

n = float(input('Digite um número: '))
por100 = float(input('Digite a %: '))

r = n * (por100/100)

print(f'{por100}% de {n} é {r:.2f} - arredondado para 2 casas decimais.')
