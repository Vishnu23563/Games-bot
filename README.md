# AI Game Bot

This project is an AI game bot that utilizes machine learning to predict actions based on input features. It is built using Flask to provide a web interface for interaction.

## Project Structure

```
ai-game-bot
├── src
│   ├── bot.py          # Main entry point for the AI game bot
│   ├── model.py        # Functions for loading the ML model and making predictions
│   └── utils.py        # Utility functions for data preprocessing and feature extraction
├── data
│   └── README.md       # Documentation about the data used in the project
├── models
│   └── README.md       # Information about the machine learning models used
├── requirements.txt     # Python dependencies required for the project
└── README.md            # Overall documentation for the project
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-game-bot
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Ensure you have the pre-trained model available at the specified path in `src/bot.py`.

## Usage Guidelines

To run the AI game bot, execute the following command:
```
python src/bot.py
```

The bot will start a Flask web server, and you can interact with it through the following endpoints:

- **POST /predict**: Send a JSON payload with the input features to get the predicted action.
- **GET /health**: Check the health status of the bot.

## Additional Information

Refer to the `data/README.md` for details about the data used in the project and `models/README.md` for information about the machine learning models.