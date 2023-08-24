import pygame
import time
import random

pygame.init()

display_width = 800
display_height = 600
black = (0, 0, 0)
white = (255, 255, 255)
red = (255, 0, 0)
car_width = 75
screen = pygame.display.set_mode((display_width, display_height))
pygame.display.set_caption('CarAI')
clock = pygame.time.Clock()
carimage = pygame.image.load('CarAi3.jpg')

# Draw a rectangle
def things(thingsx, thingsy, thingsw, thingsh, color):
    pygame.draw.rect(screen, color, [thingsx, thingsy, thingsw, thingsh])

# Draw the car image
def car(x, y):
    screen.blit(carimage, (x, y))

# Render text
def text_object(text, font):
    textSurface = font.render(text, True, black)
    return textSurface, textSurface.get_rect()

# Display a message in the center of the screen
def message_display(text):
    largeText = pygame.font.Font('freesansbold.ttf', 115)
    TextSurf, TextRect = text_object(text, largeText)
    TextRect.center = ((display_width / 2), (display_height / 2))
    screen.blit(TextSurf, TextRect)
    pygame.display.update()
    time.sleep(2)
    game_loop()

# Display points on the screen
def display_points(points):
    font = pygame.font.Font('freesansbold.ttf', 30)
    text = font.render(f'Points: {points}', True, black)
    screen.blit(text, (10, 10))

# Display a message and end the game when the car crashes
def crash():
    message_display('You Crashed')

def game_loop():
    x = (display_width * 0.50)
    y = (display_height * 0.80)
    x_change = 0
    thing_startx = random.randrange(0, display_width)
    thing_starty = -600
    thing_speed = 7
    thing_width = 100
    thing_height = 100
    points = 10 # Initialize points to 10
    hit = False # Track if the car has been hit by a rectangle
    crashed = False

    while not crashed:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    x_change = -5
                if event.key == pygame.K_RIGHT:
                    x_change = 5
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_LEFT or event.key == pygame.K_RIGHT:
                    x_change = 0

        x += x_change

        screen.fill(white)
        things(thing_startx, thing_starty, thing_width, thing_height, black)
        thing_starty += thing_speed
        car(x, y)
        display_points(points)  # Display the points on the screen

        # Check if the car touches the edge of the screen
        if x > display_width or x < 0:
            crash()

        # Check if the rectangle touches the car
        if y < thing_starty + thing_height and y + car_width > thing_starty:
            if x > thing_startx and x < thing_startx + thing_width or x + car_width > thing_startx and x + car_width < thing_startx + thing_width:
                hit = True
        
        # Reset the rectangle's position if it goes off the screen and update points
        if thing_starty > display_height:
            if hit:
                points -= 1 # Decrease points if rectangle touched car
                print(f'Points remaining: {points}')
                hit = False # Reset hit flag for the next rectangle
            if points == 0:
                crash() # Crash the car if no points left
            thing_starty = 0 - thing_height
            thing_startx = random.randrange(0, display_width)
        
        pygame.display.update()
        clock.tick(60)

game_loop()
pygame.quit()
quit()
