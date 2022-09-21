module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Distube Events Loaded");

    const EventFile = await PG(`${process.cwd()}/DistubeEvents/*/*.js`);

    EventFile.map( async (file) => {

        const event = require(file);

        client.distube.on(event.name, (...args) => event.execute(...args, client))

        await Table.addRow(event.name, "SUCCESSFUL");
    })

    console.log(Table.toString());
}