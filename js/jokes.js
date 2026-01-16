/**
 * Coffee jokes module - provides random coffee-related jokes
 */

/**
 * Array of coffee jokes
 */
const coffeeJokes = [
    "How does a tech guy drink coffee? He installs Java!",
    "What's the best Beatles song? Latte Be!",
    "Why did the coffee file a police report? It got mugged!",
    "How are coffee beans like teenagers? They're always getting grounded!",
    "What do you call sad coffee? Despresso.",
    "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
    "What's the opposite of coffee? Sneezy.",
    "How does Moses make his coffee? Hebrews it!",
    "What do you call it when you walk into a cafe you're sure you've been to before? Déjà brew.",
    "Why should you be wary of 5-cent espresso? It's a cheap shot!",
    "What did the coffee say to its date? Hey there, hot stuff!",
    "Why do coffee shops have bad WiFi? Because they want you to espresso yourself!",
    "What's a barista's favorite morning mantra? Rise and grind!",
    "Why did the coffee bean keep checking his watch? Because he was pressed for time!",
    "What do you call a cow who's just given birth? De-calf-inated!"
];

/**
 * Returns a random coffee joke from the jokes array
 * @returns {string} A random coffee joke
 */
export function getRandomJoke() {
    const randomIndex = Math.floor(Math.random() * coffeeJokes.length);
    return coffeeJokes[randomIndex];
}

/**
 * Displays a random joke in the specified element
 * @param {HTMLElement} element - The element to display the joke in
 */
export function displayRandomJoke(element) {
    if (!element) return;
    element.textContent = getRandomJoke();
}
