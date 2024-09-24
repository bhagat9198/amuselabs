import random
import time
import logging
from datetime import datetime

# Configure logging to write to the console
logging.basicConfig(
    # filename='ecommerce.log', #comment this to output logs on console.
    filename='/usr/src/app/logs/ecommerce.log', # stroring in comoon volume of docker
    level=logging.INFO,
    format='[%(levelname)s] [%(asctime)s] [module: %(module)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Expanded dictionary of product names for searching (around 50 items per category)
product_catalog = {
    'electronics': [
        'smartphone', 'laptop', '4K TV', 'headphones', 'smartwatch', 'tablet', 'gaming console',
        'bluetooth speaker', 'wireless earbuds', 'VR headset', 'home theater', 'digital camera',
        'fitness tracker', 'smart light', 'drone', 'portable charger', 'noise-cancelling headphones',
        'smart thermostat', 'e-reader', 'smart lock', 'dash cam', 'smart glasses', 'action camera',
        'robot vacuum', 'gaming mouse', 'gaming keyboard', 'LED monitor', 'mechanical keyboard',
        'external hard drive', 'flash drive', 'wireless router', 'graphics card', 'motherboard',
        'processor', 'RAM', 'SSD', 'soundbar', 'projector', 'webcam', 'video doorbell',
        'surge protector', 'power bank', 'WiFi extender', 'PC case', 'gaming chair', 'microphone',
        'monitor stand', 'green screen', 'laptop stand', 'USB hub', 'cooling pad'
    ],
    'appliances': [
        'washing machine', 'microwave oven', 'refrigerator', 'air conditioner', 'dishwasher',
        'vacuum cleaner', 'electric kettle', 'toaster', 'coffee maker', 'blender', 'food processor',
        'induction cooktop', 'water purifier', 'iron', 'water heater', 'juicer', 'sandwich maker',
        'rice cooker', 'pressure cooker', 'hand mixer', 'oven toaster grill', 'air fryer', 'deep fryer',
        'electric stove', 'grill machine', 'slow cooker', 'popcorn maker', 'steam iron', 'espresso machine',
        'stand mixer', 'ice maker', 'garment steamer', 'dehumidifier', 'humidifier', 'heater', 'ceiling fan',
        'exhaust fan', 'mop', 'floor cleaner', 'window AC', 'split AC', 'tower fan', 'robotic vacuum',
        'hair dryer', 'electric shaver', 'sewing machine', 'dish dryer', 'wine cooler', 'chest freezer'
    ],
    'furniture': [
        'sofa', 'dining table', 'office chair', 'bookshelf', 'TV stand', 'coffee table', 'bed frame',
        'wardrobe', 'nightstand', 'dressing table', 'recliner', 'study desk', 'console table',
        'sectional sofa', 'shoe rack', 'bar stool', 'kitchen cabinet', 'rocking chair', 'armchair',
        'storage bench', 'garden bench', 'deck chair', 'outdoor sofa', 'hammock', 'folding chair',
        'ottoman', 'bean bag', 'drawer chest', 'sideboard', 'display cabinet', 'kitchen island',
        'kitchen cart', 'patio table', 'lawn chair', 'accent chair', 'corner shelf', 'headboard',
        'dining bench', 'coat rack', 'umbrella stand', 'laundry basket', 'plant stand', 'room divider',
        'writing desk', 'console shelf', 'jewelry armoire', 'vanity mirror', 'massage chair', 'chaise lounge'
    ],
    'clothing': [
        't-shirt', 'jeans', 'jacket', 'dress', 'shoes', 'sneakers', 'boots', 'sweater', 'hoodie', 'polo shirt',
        'blazer', 'suit', 'trousers', 'shorts', 'skirt', 'coat', 'cardigan', 'hat', 'scarf', 'gloves',
        'socks', 'swimsuit', 'tank top', 'leggings', 'sports bra', 'raincoat', 'flip-flops', 'sandals',
        'belt', 'handbag', 'backpack', 'wallet', 'necklace', 'earrings', 'bracelet', 'sunglasses', 'watch',
        'ring', 'hairband', 'bikini', 'overalls', 'beanie', 'headscarf', 'tie', 'bow tie', 'stockings',
        'tights', 'pajamas', 'bathrobe', 'work boots', 'cycling gear'
    ]
}

# Simulate eCommerce modules generating log messages
modules = [
    'SearchService', 'PaymentService', 'OrderService',
    'CartService', 'InventoryService', 'ShippingService', 'ReviewService'
]

# Simulate different log actions for each module
actions = {
    'SearchService': [
        "Product search for query '{}'",
        "Product search timeout for query '{}'"
    ],
    'PaymentService': [
        "Payment processed successfully for order ID #{} amount: ${}",
        "Payment failed for order ID #{} amount: ${}"
    ],
    'OrderService': [
        "Order #{} created for user ID #{}",
        "Order #{} canceled by user ID #{}",
        "Order #{} shipped to user ID #{}"
    ],
    'CartService': [
        "User ID #{} added product ID #{} to cart",
        "User ID #{} failed to add product ID #{} to cart, out of stock"
    ],
    'InventoryService': [
        "Stock updated for product ID #{}: new stock {} units",
        "Low stock warning for product ID #{}: only {} units left"
    ],
    'ShippingService': [
        "Shipping label generated for order ID #{}",
        "Shipping delay for order ID #{}"
    ],
    'ReviewService': [
        "User ID #{} submitted a review for product ID #{}: rating {} stars",
        "User ID #{} reported an issue with review on product ID #{}"
    ]
}

# Generate random log levels
log_levels = ['INFO', 'WARN', 'ERROR']

# Generate 900 order IDs, 500 user IDs, and 50 product IDs
user_ids = [i for i in range(1001, 1501)]  # 500 user entries
order_ids = [i for i in range(2001, 2901)]  # 900 order entries
product_ids = [i for i in range(3001, 3051)]  # 50 product entries

def random_product_search():
    """Select a random product from the product catalog"""
    category = random.choice(list(product_catalog.keys()))  # Pick a random category
    product = random.choice(product_catalog[category])  # Pick a random product from the category
    return product

def generate_log():
    """Function to generate a random log event"""
    module = random.choice(modules)  # Select a random module
    log_level = random.choice(log_levels)  # Select a random log level
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Get current time
    message = ""

    # Generate a message based on the selected module
    if module == 'SearchService':
        product = random_product_search()  # Select a random product for the search query
        message = random.choice(actions[module]).format(product)
    elif module == 'PaymentService':
        order_id = random.choice(order_ids)
        amount = round(random.uniform(20.0, 500.0), 2)
        message = random.choice(actions[module]).format(order_id, amount)
    elif module == 'OrderService':
        order_id = random.choice(order_ids)
        user_id = random.choice(user_ids)
        message = random.choice(actions[module]).format(order_id, user_id)
    elif module == 'CartService':
        user_id = random.choice(user_ids)
        product_id = random.choice(product_ids)
        message = random.choice(actions[module]).format(user_id, product_id)
    elif module == 'InventoryService':
        product_id = random.choice(product_ids)
        stock = random.randint(0, 100)
        message = random.choice(actions[module]).format(product_id, stock)
    elif module == 'ShippingService':
        order_id = random.choice(order_ids)
        message = random.choice(actions[module]).format(order_id)
    elif module == 'ReviewService':
        user_id = random.choice(user_ids)
        product_id = random.choice(product_ids)
        rating = random.randint(1, 5)
        message = random.choice(actions[module]).format(user_id, product_id, rating)
    
    # Log the message using the logging module
    if log_level == 'INFO':
        logging.info(message)
    elif log_level == 'WARN':
        logging.warning(message)
    elif log_level == 'ERROR':
        logging.error(message)

if __name__ == "__main__":
    print("Starting log generation...")
    while True:
        generate_log()
        time.sleep(random.uniform(0.5, 2))  # Simulate log generation rate