CREATE DATABASE meRaffle;
GO
USE meRaffle;
GO
CREATE TABLE drawNumber (
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    totalNumbers INT NOT NULL,
    creationDate DATETIME NOT NULL,
    dateGame DATETIME NOT NULL,
    avaliableNumbers INT NOT NULL,
    winningNumber INT NULL,
	tikectValue INT NULL
);
GO
CREATE TABLE filledNumbers (
    id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    idDraw INT NOT NULL,
    number INT NOT NULL,
    userCode VARCHAR(20) NOT NULL,
    saveDate DATETIME NOT NULL,
    CONSTRAINT FK_filledNumbers_drawNumber FOREIGN KEY (idDraw) REFERENCES drawNumber(id)
);
GO
CREATE TABLE userParticipant (
	credentialNumber INT PRIMARY KEY NOT NULL,
	nameUser VARCHAR(30) NOT NULL,
	lastName VARCHAR(30) NOT NULL,
	emailUser VARCHAR (30) NOT NULL,
	phoneUser INT NOT NULL,
	ticketsNumber INT NOT NULL,
	assignedCode VARCHAR (20) NULL
);
GO
CREATE TABLE playingUser (
	id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	credentialNumber INT NOT NULL,
	purchaseDateTickets DATETIME NOT NULL,
	drawNumberId INT NOT NULL,
	CONSTRAINT FK_playingUser_userParticipant FOREIGN KEY (credentialNumber) REFERENCES userParticipant(credentialNumber),
	CONSTRAINT FK_playingUser_drawNumber FOREIGN KEY (drawNumberId) REFERENCES drawNumber(id)
);