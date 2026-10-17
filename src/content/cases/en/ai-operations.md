---
key: "case:ai-operations"
locale: "en"
title: "AI Agents & Model Operations | Abdullah Mansour"
description: "Model selection, hosting and agent integration for {{metric:ai.users.value}} people, with a shared environment below US${{metric:ai.cost.value}} per working day and merged LocalAI contributions."
heading: "Models, agents and integration: building a shared AI environment."
lead: "At Tahliq, I evaluated models, built a shared operating environment, connected it to agent tools and worked through problems exposed by actual use. {{metric:ai.users.value}} people gained an execution path for suitable tasks, with the environment running below US${{metric:ai.cost.value}} during the working day and stronger models retained where needed."
updatedAt: "2026-10-16"
draft: false
---

## The more useful AI became, the harder its usage was to manage {#constraint}

As the team used agents for more work, usage limits became an operational constraint. The choices included waiting for a reset, buying additional capacity or managing growing consumption-based costs.

The work needed a way to allocate tasks that supported continued delivery and made higher-capability models available where their contribution mattered most.

## I changed how the work was allocated {#allocation}

I kept planning, difficult decisions and output supervision with the stronger models, and built a shared hosted-model path for suitable execution tasks.

I assessed options for reasoning, output quality on relevant tasks, operating requirements, image support and context length. I configured LocalAI and llama.cpp on two NVIDIA L4 GPUs, with image support and a context window of up to 256K tokens.

The purpose was to improve operating economics while retaining task selection, review and human responsibility for the work.

## I connected the model to the agents and their working environment {#integration}

I configured integration with Codex and Claude Code, putting the hosted model into the team’s execution workflow. As part of Tahliq’s wider AI setup, I also developed custom skills and MCP integrations connecting agents to their tools, and trained the team to use them.

The work required decisions about the task, the capability it needed, the model and its environment, and the tools and context available to the agent. I continued to direct execution, assess the output and address obstacles as they appeared.

## Integration exposed problems worth fixing at their source {#contributions}

I traced a LocalAI compatibility issue affecting Codex, directed AI agents through the fix and reviewed the change and checks. The contribution was accepted into the upstream project.

[LocalAI compatibility contribution — #11608](https://github.com/mudler/LocalAI/pull/11608)

I also tested documentation claims about combining image processing and faster generation, then submitted a correction supported by runtime evidence. That contribution was accepted and merged too.

[LocalAI documentation correction — #11700](https://github.com/mudler/LocalAI/pull/11700)

![{{evidence:ai-localai-11608.alt}}](/media/evidence/ai-operations/01-localai-11608.png)

*A compatibility fix accepted into LocalAI, with a public record of the change and review.*

![{{evidence:ai-localai-11700.alt}}](/media/evidence/ai-operations/02-localai-11700.png)

*A documentation correction supported by practical testing and accepted upstream.*

## What changed for the team {#outcome}

{{metric:ai.users.value}} people gained a shared execution path for suitable tasks, with the hosted environment running at less than US${{metric:ai.cost.value}} during the working day. Stronger models remained in use for planning, supervision and harder tasks.

The project brings together several levels of my AI expertise: model selection and hosting, agent integration, task direction, output review and following a problem into the original tool when the solution requires it.

In marketing, that capability expands delivery across research, analysis, production and automation. Elkhabar Bewodooh shows another application, through the filming and publishing tools I built around its content strategy.

[Explore the media production application](/work/elkhabar-bewodooh/)

[Review my agency experience](/resume/) · [Discuss your team’s needs](/contact/)
