-- ═══════════════════════════════════════════════════════════
--  AIPG BD — Initial SQL Server Schema
--  Run this manually OR let EF Core Migrate() handle it
-- ═══════════════════════════════════════════════════════════

-- ── Divisions ────────────────────────────────────────────────
CREATE TABLE Divisions (
    Id    INT          NOT NULL PRIMARY KEY,
    Name  NVARCHAR(50) NOT NULL,
    Slug  NVARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Divisions VALUES (1, 'Studios', 'studios');
INSERT INTO Divisions VALUES (2, 'Systems', 'systems');

-- ── Portfolios ───────────────────────────────────────────────
CREATE TABLE Portfolios (
    Id           INT            NOT NULL PRIMARY KEY IDENTITY,
    DivisionId   INT            NOT NULL REFERENCES Divisions(Id),
    Title        NVARCHAR(200)  NOT NULL,
    Slug         NVARCHAR(200)  NOT NULL,
    Description  NVARCHAR(MAX)  NOT NULL DEFAULT '',
    ThumbnailUrl NVARCHAR(500)  NOT NULL DEFAULT '',
    MediaUrl     NVARCHAR(500)  NOT NULL DEFAULT '',
    Tags         NVARCHAR(500)  NOT NULL DEFAULT '',
    IsFeatured   BIT            NOT NULL DEFAULT 0,
    IsPublished  BIT            NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt    DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    UNIQUE (DivisionId, Slug)
);
CREATE INDEX IX_Portfolios_Division ON Portfolios (DivisionId, IsPublished);

-- ── Services ─────────────────────────────────────────────────
CREATE TABLE Services (
    Id          INT            NOT NULL PRIMARY KEY IDENTITY,
    DivisionId  INT            NOT NULL REFERENCES Divisions(Id),
    Title       NVARCHAR(200)  NOT NULL,
    Slug        NVARCHAR(200)  NOT NULL,
    Description NVARCHAR(MAX)  NOT NULL DEFAULT '',
    Icon        NVARCHAR(50)   NOT NULL DEFAULT '',
    PriceFrom   DECIMAL(10,2)  NULL,
    Currency    NVARCHAR(10)   NOT NULL DEFAULT 'USD',
    SortOrder   INT            NOT NULL DEFAULT 0,
    IsActive    BIT            NOT NULL DEFAULT 1,
    CreatedAt   DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);
CREATE INDEX IX_Services_Division ON Services (DivisionId, IsActive, SortOrder);

-- ── Leads ────────────────────────────────────────────────────
CREATE TABLE Leads (
    Id         INT            NOT NULL PRIMARY KEY IDENTITY,
    DivisionId INT            NOT NULL REFERENCES Divisions(Id),
    Name       NVARCHAR(100)  NOT NULL,
    Email      NVARCHAR(200)  NOT NULL,
    Phone      NVARCHAR(50)   NOT NULL DEFAULT '',
    Company    NVARCHAR(200)  NOT NULL DEFAULT '',
    Message    NVARCHAR(MAX)  NOT NULL DEFAULT '',
    Budget     NVARCHAR(100)  NOT NULL DEFAULT '',
    Status     NVARCHAR(20)   NOT NULL DEFAULT 'New',
    AdminNote  NVARCHAR(MAX)  NOT NULL DEFAULT '',
    CreatedAt  DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);
CREATE INDEX IX_Leads_Division ON Leads (DivisionId, Status, CreatedAt DESC);

-- ── SocialPosts ──────────────────────────────────────────────
CREATE TABLE SocialPosts (
    Id              INT            NOT NULL PRIMARY KEY IDENTITY,
    DivisionId      INT            NOT NULL REFERENCES Divisions(Id),
    Caption         NVARCHAR(MAX)  NOT NULL,
    MediaUrl        NVARCHAR(500)  NOT NULL DEFAULT '',
    MediaType       NVARCHAR(20)   NOT NULL DEFAULT 'image',
    Platforms       INT            NOT NULL DEFAULT 0,  -- bitmask
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'Draft',
    ScheduledAt     DATETIME2      NULL,
    PublishedAt     DATETIME2      NULL,
    FacebookPostId  NVARCHAR(100)  NULL,
    InstagramPostId NVARCHAR(100)  NULL,
    YouTubeVideoId  NVARCHAR(100)  NULL,
    LinkedInPostId  NVARCHAR(100)  NULL,
    ErrorDetails    NVARCHAR(MAX)  NULL,
    CreatedAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);
CREATE INDEX IX_SocialPosts_Status ON SocialPosts (Status, ScheduledAt);
