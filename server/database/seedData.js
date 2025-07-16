const { collections } = require("./mongoCollections");

const sampleTerms = [
  {
    term: "Air Dribble",
    definition:
      "A technique where a player keeps the ball in the air while driving up the wall and then continues to control it in the air.",
    category: "Mechanics",
    exampleUsage: "I just hit a perfect air dribble from midfield to score!",
    skillLevel: "Intermediate",
    submittedBy: "RocketLeaguePro",
    likeCount: 15,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    term: "Flip Reset",
    definition:
      "A mechanic where a player touches all four wheels to the ball while in the air, resetting their flip and allowing them to perform another aerial maneuver.",
    category: "Mechanics",
    exampleUsage: "That flip reset goal was absolutely insane!",
    skillLevel: "Pro",
    submittedBy: "MechanicMaster",
    likeCount: 23,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    term: "Wave Dash",
    definition:
      "A technique where a player diagonally flips and then cancels the flip while touching the ground, creating a speed boost.",
    category: "Mechanics",
    exampleUsage: "Use wave dash to maintain momentum after landing.",
    skillLevel: "Intermediate",
    submittedBy: "SpeedDemon",
    likeCount: 8,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    term: "What a Save!",
    definition:
      "A quick chat message used sarcastically when an opponent misses an easy save or when celebrating a goal.",
    category: "Slang",
    exampleUsage: "After scoring an open net goal, spam 'What a Save!'",
    skillLevel: "Beginner",
    submittedBy: "ChatSpammer",
    likeCount: 5,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    term: "Rotation",
    definition:
      "The systematic movement of players between offensive and defensive positions to maintain proper field coverage.",
    category: "Strategy",
    exampleUsage: "Good rotation is key to winning at higher ranks.",
    skillLevel: "Beginner",
    submittedBy: "CoachRL",
    likeCount: 12,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    term: "Demo",
    definition:
      "Short for demolition - when a player destroys an opponent's car by hitting them at supersonic speed.",
    category: "Tactics",
    exampleUsage: "I got demoed right before the ball went in!",
    skillLevel: "Beginner",
    submittedBy: "DemoKing",
    likeCount: 7,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleRecords = [
  {
    title: "Fastest Goal from Kickoff",
    description:
      "Scored a goal in just 1.2 seconds from the initial kickoff, beating the previous record of 1.5 seconds.",
    category: "Fastest Goal",
    recordHolderName: "SpeedDemon99",
    proofUrl: "https://youtube.com/watch?v=example1",
    dateAchieved: new Date("2024-01-15"),
    submittedBy: "RecordKeeper",
    likeCount: 45,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Longest Air Dribble",
    description:
      "Maintained an air dribble for 47 seconds across the entire field, setting a new world record.",
    category: "Longest Air Dribble",
    recordHolderName: "AirMaster",
    proofUrl: "https://youtube.com/watch?v=example2",
    dateAchieved: new Date("2024-02-20"),
    submittedBy: "MechanicFan",
    likeCount: 67,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Highest MMR in 1v1",
    description:
      "Achieved the highest MMR ever recorded in 1v1 competitive play at 2,847 points.",
    category: "Highest MMR",
    recordHolderName: "ProPlayer123",
    proofUrl: "https://youtube.com/watch?v=example3",
    dateAchieved: new Date("2024-03-10"),
    submittedBy: "RankTracker",
    likeCount: 89,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Most Goals in a Single Match",
    description:
      "Scored 12 goals in a single competitive match, breaking the previous record of 10 goals.",
    category: "Most Goals in Match",
    recordHolderName: "GoalMachine",
    proofUrl: "https://youtube.com/watch?v=example4",
    dateAchieved: new Date("2024-01-30"),
    submittedBy: "MatchRecorder",
    likeCount: 34,
    likedBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await collections.termsCollection.deleteMany({});
    await collections.recordsCollection.deleteMany({});

    // Insert sample terms
    if (sampleTerms.length > 0) {
      await collections.termsCollection.insertMany(sampleTerms);
      console.log(`Inserted ${sampleTerms.length} sample terms`);
    }

    // Insert sample records
    if (sampleRecords.length > 0) {
      await collections.recordsCollection.insertMany(sampleRecords);
      console.log(`Inserted ${sampleRecords.length} sample records`);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

module.exports = { seedDatabase };
