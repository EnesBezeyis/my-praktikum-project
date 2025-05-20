import pygame
import random

# Pygame başlatma
pygame.init()

# Ekran boyutları
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")

# Renkler
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Paddle (raket) özellikleri
PADDLE_WIDTH, PADDLE_HEIGHT = 15, 90
ball_radius = 10

# Hız
PADDLE_SPEED = 15
BALL_SPEED_X = 5
BALL_SPEED_Y = 5

# FPS kontrolü
clock = pygame.time.Clock()

# Skorlar
player_score = 0
opponent_score = 0

# Paddle sınıfı
class Paddle:
    def __init__(self, x, y):
        self.rect = pygame.Rect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT)

    def move(self, speed):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP] and self.rect.top > 0:
            self.rect.y -= speed
        if keys[pygame.K_DOWN] and self.rect.bottom < HEIGHT:
            self.rect.y += speed

# Top sınıfı
class Ball:
    def __init__(self):
        self.rect = pygame.Rect(WIDTH // 2 - ball_radius, HEIGHT // 2 - ball_radius, ball_radius * 2, ball_radius * 2)
        self.x_velocity = BALL_SPEED_X * random.choice((1, -1))
        self.y_velocity = BALL_SPEED_Y * random.choice((1, -1))

    def move(self):
        self.rect.x += self.x_velocity
        self.rect.y += self.y_velocity

        # Ekran duvarlarına çarpma
        if self.rect.top <= 0 or self.rect.bottom >= HEIGHT:
            self.y_velocity = -self.y_velocity

    def reset(self):
        self.rect.center = (WIDTH // 2, HEIGHT // 2)
        self.x_velocity = BALL_SPEED_X * random.choice((1, -1))
        self.y_velocity = BALL_SPEED_Y * random.choice((1, -1))

# Oyun döngüsü
def game_loop():
    global player_score, opponent_score

    # Paddle ve top oluşturma
    player = Paddle(50, HEIGHT // 2 - PADDLE_HEIGHT // 2)
    opponent = Paddle(WIDTH - 50 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2)
    ball = Ball()

    # Oyun döngüsü
    while True:
        screen.fill(BLACK)

        # Olaylar (events)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()

        # Paddle'ları hareket ettirme
        player.move(PADDLE_SPEED)
        opponent.move(PADDLE_SPEED)

        # Topu hareket ettirme
        ball.move()

        # Top raketlere çarparsa yön değiştirir
        if ball.rect.colliderect(player.rect) or ball.rect.colliderect(opponent.rect):
            ball.x_velocity = -ball.x_velocity

        # Top raketleri geçerse skor eklenir
        if ball.rect.left <= 0:
            opponent_score += 1
            ball.reset()

        if ball.rect.right >= WIDTH:
            player_score += 1
            ball.reset()

        # Skorları yazdırma
        font = pygame.font.SysFont(None, 50)
        player_text = font.render(str(player_score), True, WHITE)
        opponent_text = font.render(str(opponent_score), True, WHITE)
        screen.blit(player_text, (WIDTH // 4, 20))
        screen.blit(opponent_text, (WIDTH * 3 // 4 - opponent_text.get_width(), 20))

        # Paddle'ları ekrana çizme
        pygame.draw.rect(screen, WHITE, player.rect)
        pygame.draw.rect(screen, WHITE, opponent.rect)

        # Topu ekrana çizme
        pygame.draw.ellipse(screen, WHITE, ball.rect)

        # Ekranı güncelleme
        pygame.display.update()

        # FPS (frame per second) ayarlama
        clock.tick(60)

# Oyunu başlat
game_loop()
