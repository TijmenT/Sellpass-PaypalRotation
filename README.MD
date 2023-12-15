# Sellpass PayPal F&F Rotation Bot

This Discord bot automates the process of rotating your PayPal F&F email on Sellpass based on the total amount of sales made in a day.

## Usage Instructions

### Initial Setup

1. **Rename Configuration File**: Change the name of the `.envREMOVEME` file to `.env`.
2. **Create a Discord Bot**:
   - Visit [Discord Developer Portal](https://discord.com/developers/applications).
   - Create a new application and enable all Privileged Gateway Intents under the "Bot" tab.
   - Reset the token and update it in your `.env` file.
3. **Sellpass API Key**:
   - Obtain your Sellpass API key from [Sellpass Security Settings](https://dashboard.sellpass.io/settings/security) and add it to your `.env` file.
4. **Shop ID**: 
   - Find your shop ID by inspecting elements on Sellpass. Can be found by inspecting element, opening console, click on a product and there should be a link with like: api.sellpass.io/public/ID. Update this ID in your `.env` file.
5. **Invite Bot to Your Server**: 
   - Use this URL, replacing `YourClientId` with your actual client ID from the Discord Developer Portal: `https://discord.com/oauth2/authorize?client_id=YourClientId&scope=bot&permissions=8`.
6. **Webhook Setup**:
   - Create a Discord webhook and input the URL in your Sellpass notifications settings at [Sellpass Notifications](https://dashboard.sellpass.io/settings/notifications). Ensure the "When order is completed" option is enabled.
7. **Node.JS**:
   - Download and install Node.JS LTS from the [official site](https://nodejs.org/).
8. **Install Dependencies**: 
   - Open a terminal in the bot's folder and run `npm install`.

### Database Configuration

1. **Database Setup**: 
   - Set up your database according to the provided SQL schema.
2. **Database Connection**: 
   - Modify `src/db.js` with your database settings to ensure proper connectivity.

### Final Steps

1. **Start the Bot**: 
   - Run `npm start` in a terminal within the bot's directory.

**Note**: The above steps are comprehensive, but you may need to adjust certain aspects based on your specific setup or environment.
