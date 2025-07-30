import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

const TaggedText = ({
  text,
  tags = [],
  variant = "body2",
  color = "text.secondary",
  sx,
}) => {
  if (!text) return null;

  // If no tags, render as plain text
  if (!tags || tags.length === 0) {
    return (
      <Typography variant={variant} color={color} sx={sx}>
        {text}
      </Typography>
    );
  }

  // Create a map of position to tag for easy lookup
  const tagMap = tags.reduce((acc, tag) => {
    acc[tag.position] = tag;
    return acc;
  }, {});

  // Split text by @N@ pattern where N is the position
  const parts = text.split(/(@\d+@)/g);

  return (
    <Typography variant={variant} color={color} sx={sx}>
      {parts.map((part, index) => {
        const tagMatch = part.match(/@(\d+)@/);
        if (tagMatch) {
          const position = parseInt(tagMatch[1]);
          const tag = tagMap[position];

          if (tag) {
            return (
              <Link
                key={index}
                to={tag.page}
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                {tag.tagTitle}
              </Link>
            );
          }
        }
        return part;
      })}
    </Typography>
  );
};

export default TaggedText;
